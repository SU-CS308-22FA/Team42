require("dotenv").config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');

const MongoStore = require('connect-mongo');

app.use(session({
    store: MongoStore.create({ mongoUrl: process.env.DATABASE }),
    secret: 'foo'
}));

app.use(cors({
    origin: "*",
}));

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
app.use(require('./routes/competition'));


//Starting the server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});