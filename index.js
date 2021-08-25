if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}


let express = require('express');

const expressLayouts = require('express-ejs-layouts');

let cors = require('cors');

let app = express();

let parcelRepo = require('./repo/parcelRepo');

let router = express.Router();

app.use(express.json());

app.use(cors());

var path = require("path");
var _dirname = path.resolve();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));


app.set('views', _dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, {
useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.log('connected to Mongoose'));   

router.get('/', function (req, res) {
    res.render('index.ejs');
});

router.get('/index', function (req, res) {
    res.render('index.ejs');
});

router.get('/signup', function (req, res) {
    res.render('signup.ejs');
});

router.get('/parcel', function (req, res, next) {
    parcelRepo.get(function (data) {
        res.status(200).json({
            "status": 200,
            "statusText": "ok",
            "message": "All details received",
            "data": data
        });
    },
        function (err) {
            next(err);
        });
});

router.get('/users/:id/parcels', function (req, res, next) {
    let searchObject = {
        "user": req.query.user
    };

    parcelRepo.search(searchObject, function (data) {
        res.status(200).json({
            "status": 200,
            "statusText": "ok",
            "message": "All pies retrieved.",
            "data": data
        });
    }, function (err) {
        next(err);
    });
});

router.get('/parcels/:id', function (req, res, next) {
    parcelRepo.getById(req.params.id, function (data) {
        if (data) {
            res.status(200).json({
                "status": 200,
                "statusText": "ok",
                "message": "single parcel retrieved.",
                "data": data
            });
        }
        else {
            res.status(404).json({
                "status": 404,
                "statusText": "not found",
                "message": "the parcel '" + req.params.id + "'could not be found.",
                "error": {
                    "code": "NOT FOUND",
                    "Message": "The parcel '" + req.params.id + "' could not be found."
                }
            });
        }
    }, function (err) {
        next(err);
    });
});

router.get('/parcels', (req, res) => {
    res.render('create.ejs');

});

router.post('/parcels', function (req, res, next) {
    let creates = {
        FullName: req.body.FullName,
        presntlocation: req.body.presentlocation,
        destination: req.body.destination,
        itemname: req.body.itemname
    };
    parcelRepo.insert(creates, function (data) {
        res.status(201).json({
            "status": 201,
            "statusText": "created",
            "message": "new pie added",
            "data": data
        });
    },
        function (err) {
            next(err);
        });
});

router.post('/signup', function (req, res, next) {
    let signup = {
        "Firstname": req.body.Firstname,
        "Lastname": req.body.Lastname,
        "password": req.body.password,
        "email": req.body.email,
        "Username": req.body.Username
    };
    parcelRepo.insert(signup, function (data) {
        res.status(201).json({
            "status": 201,
            "statusText": "created",
            "message": "new pie added",
            "data": data
        });
    },
        function (err) {
            next(err);
        });
});


router.post('/index', function (req, res, next) {
    let login = {
        "username": req.body.username,
        "password": req.body.password
    };
    parcelRepo.insert(login, function (data) {
        res.status(201).json({
            "status": 201,
            "statusText": "created",
            "message": "new profile added added",
            "data": data
        });
    },
        function (err) {
            next(err);
        });
});

router.get('/parcels/:id/destination', (req, res) => {
    res.render('destination.ejs');

});

router.put('/parcels/:id/destination', function (req, res, next){
    let destine = {
        "FullName": req.body.FullName,
        "destination": req.body.destination,
        "id": req.body.id
    };
    
    parcelRepo.getById(req.params, function (data) {
        if (data) {
            // Attempt to update
            parcelRepo.update(destine, req.params, function (data) {
                res.status(200).json({
                    "status": 200,
                    "statusText": "ok",
                    "message": "parcel '" + req.params + "' update. ",
                    "data": data
                });
            });
        }
        else {
            res.status(400).json({
                "status": 400,
                "statusText": "Not found",
                "message": "The parcel '" + req.params + "' could not be found.",
                "error": {
                    "code": "NOT FOUND",
                    "message": "The parcel '" + req.params + "' could not be found."
                }
            });
        }
    }, function(err){
        next(err);
    });
});

router.delete('/:id', function (req, res, next) {
    parcelRepo.getById(req.params.id, function (data) {
        if (data) {
            parcelRepo.delete(req.params.id, function (data) {
                res.status(200).json({
                    "status": 200,
                    "statusText": 'ok',
                    "message": "the parcel ' " + req.params.id + " ' is deleted",
                    "data": "parcel '" + req.params.id + "' deleted"
                });
            });
        }
        else {
            res.status(404).json({
                "status": 404,
                "statusText": "not found",
                "message": "the parcel '" + req.params.id + " ' could not be deleted",
                "error": {
                    "code": "not found",
                    "message": "the parcel '" + req.params.id + "' could not delete"
                }
            });
        }
    }, function (err) {
        next(err);
    });
});

router.put('/parcels/:id/presentLocation', function (req, res, next) {
    parcelRepo.getById(req.params.id, function (data) {
        if (data) {
            // Attempt to update
            parcelRepo.update(req.body, req.params.id, function (data) {
                res.status(200).json({
                    "status": 200,
                    "statusText": "ok",
                    "message": "parcel '" + req.params.id + "' update. ",
                    "data": data
                });
            });
        }
        else {
            res.status(400).json({
                "status": 400,
                "statusText": "Not found",
                "message": "The parcel '" + req.params.id + "' could not be found.",
                "error": {
                    "code": "NOT FOUND",
                    "message": "The parcel '" + req.params.id + "' could not be found."
                }
            });
        }
    }, function (err) {
        next(err);
    });
});

router.put('/parcels/:id/status', function (req, res, next) {
    parcelRepo.getById(req.params.id, function (data) {
        if (data) {
            // Attempt to update
            parcelRepo.update(req.body, req.params.id, function (data) {
                res.status(200).json({
                    "status": 200,
                    "statusText": "ok",
                    "message": "parcel '" + req.params.id + "' update. ",
                    "data": data
                });
            });
        }
        else {
            res.status(400).json({
                "status": 400,
                "statusText": "Not found",
                "message": "The parcel '" + req.params.id + "' could not be found.",
                "error": {
                    "code": "NOT FOUND",
                    "message": "The parcel '" + req.params.id + "' could not be found."
                }
            });
        }
    }, function (err) {
        next(err);
    });
});

app.use('/', router);

app.listen(process.env.PORT  || 27017);