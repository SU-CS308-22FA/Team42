require("dotenv").config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();

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


//Starting the server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});