const { Router } = require('express');
const router = Router();
var crypto = require('crypto');
const User = require('../models/admin')
const { appendFile } = require('fs');
var session = require('express-session');

router.use(session({secret:"minu238g02839ji4jijn3928", resave:false,saveUninitialized:true}));

router.get('/api/admins', async (req,res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch(err) {
        res.status(500).json({ message: err.message })
    }
});

router.get('/api/admins/:_id', getUser, (req,res) => {
    res.json(res.user);
})

router.post('/api/admins/register', async (req,res) => {
    const {admin_login, fullname, password} = req.body;
    var hash = crypto.createHash('sha256').update(password).digest('hex');
    console.log(req.body);
    const user = new User({
        admin_login: admin_login,
        fullname: fullname,
        password: hash,
        created_at: new Date,
        modified_at: new Date,
    })
    try {
        const newUser = await user.save()
        res.status(201).json(newUser)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
});

router.post('/api/admins/login', async (req,res) => {
    const {admin_login, password} = req.body;
    var hash = crypto.createHash('sha256').update(password).digest('hex');
    console.log(req.body);
    User.findOne({admin_login: admin_login, password: hash}, function(err, user) {
        if(err) {
            console.log(err);
            return res.status(500).send();
        } if(!user) {
            return res.status(404).send();
        } 
        req.session.user = user;
        user_id = user._id
        session_id = req.sessionID
        var loginObject = { user_id, session_id}
        //return res.status(200).json(req.sessionID);
        return res.status(200).json(loginObject);
    });
});



router.delete('/api/admins/delete/:_id', getUser, async (req, res) => {
    try {
        await res.user.remove()
        res.json({ message: "Deleted Subscriber"})
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

router.put('/api/admins/update/:_id', getUser, async (req, res) => {
    if(req.body.admin_login != null) {
        res.user.admin_login = req.body.admin_login
    } if(req.body.fullname != null) {
        res.user.fullname = req.body.fullname
    } if(req.body.password != null) {
        var hash = crypto.createHash('sha256').update(req.body.password).digest('hex');
        res.user.password = hash
    }
    try {
        const updatedUser = await res.user.save()
        res.user.modified_at = new Date
        res.json(updatedUser)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.get('admin/auth', async function(req,res) {
    if(!req.session.user) {
        console.log("Incorrect");
        return res.status(401).send();
    }
    var user = await User.find(req.session.user)
    var session_id = req.sessionID
    var object = { user, session_id }
    return res.status(200).json(object);
});


async function getUser(req, res, next) {
    let user
    try {
        user = await User.findById(req.params)
        if(user == null) {
            return res.status(404).json({message: 'Cannot find User'})
        }
    } catch (err) {
        return res.status(500).json({message: err.message})
    }

    res.user = user
    next()
}

module.exports = router;