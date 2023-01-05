const { Router } = require('express');
const router = Router();
var crypto = require('crypto');
const User = require('../models/user')
const { appendFile } = require('fs');
var session = require('express-session');

router.use(session({secret:"minu238g02839ji4jijn3928", resave:false,saveUninitialized:true}));

router.get('/api/profiles', async (req,res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch(err) {
        res.status(500).json({ message: err.message })
    }
});

router.get('/api/profiles/:_id', getUser, (req,res) => {
    res.json(res.user);
})

router.get('/api/profiles/friends/:_id', getUser, (req,res) => {
    res.json(res.user.friends);
})

router.post('/api/profiles/register', async (req,res) => {
    const {email, fullname, phone, password} = req.body;
    var hash = crypto.createHash('sha256').update(password).digest('hex');
    console.log(req.body);
    const user = new User({
        email: email,
        fullname: fullname,
        phone: phone,
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

router.post('/api/profiles/login', async (req,res) => {
    const {email, password} = req.body;
    var hash = crypto.createHash('sha256').update(password).digest('hex');
    console.log(req.body);
    User.findOne({email: email, password: hash}, function(err, user) {
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



router.delete('/api/profiles/delete/:_id', getUser, async (req, res) => {
    try {
        await res.user.remove()
        res.json({ message: "Deleted Subscriber"})
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

router.put('/api/profiles/update/:_id', getUser, async (req, res) => {
    if(req.body.email != null) {
        res.user.email = req.body.email
    } if(req.body.fullname != null) {
        res.user.fullname = req.body.fullname
    } if(req.body.phone != null) {
        res.user.phone = req.body.phone
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

router.put('/api/profiles/add/friend/:_id', getUser, async (req, res) => {
    if(req.body._id != null) {
        res.user.friends.push(req.body._id)
        const updatedUser = await res.user.save()
        res.user.modified_at = new Date
        return res.json(updatedUser)
    } else {
        return res.status(400).json({"Error": "Error"})
    }
})

router.get('/auth', async function(req,res) {
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