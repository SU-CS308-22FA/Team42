require("dotenv").config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require('cors');

const corsOpt = {
    credentials: true,
    origin: process.env.CORS_ALLOW_ORIGIN || '*', // this work well to configure origin url in the server
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'], // to works well with web app, OPTIONS is required
    allowedHeaders: ['Content-Type', 'Authorization'] // allow json and token in the headers
};
app.use(cors(corsOpt)); // cors for all the routes of the application
app.options('*', cors(corsOpt)); 

// app.use(cors({
//     origin: "*",
//     methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
// }));

//Settings
app.set('port', process.env.PORT || 8000);

//Middlewares
app.use(express.json());

//DB Connection
mongoose
    .connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("DB CONNECTED");
    });

//Routes
//app.use(errors.errorHandler);
app.use(require('./routes/profile'));
app.use(require('./routes/admins'));
app.use(require('./routes/competitions'));
app.use(require('./routes/teams'));
app.use(require('./routes/search'));
app.use(require('./routes/friend_request'));

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving Something with ID: ' + id);
    var collection = db.collection('playDB');
    collection.findOne({'_id':new BSON.ObjectID(id)},{}, function(err, item) {
      res.send(item);
    });
};

exports.findAll = function(req, res) {
    var collection = db.collection('playDB');
    collection.find().toArray(function(err, items) {
      res.send(items);
    });
};

//Starting the server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});