const { Router } = require('express');
const router = Router();
var crypto = require('crypto');
const User = require('../models/user');
const { appendFile } = require('fs');
var session = require('express-session');

router.use(session({secret:"minu238g02839ji4jijn3928", resave:false,saveUninitialized:true}));

router.get('/api/admins', async (req,res) => {
    try {
        const users = await User.find({is_admin: true})
        res.json(users)
    } catch(err) {
        res.status(500).json({ message: err.message })
    }
});

router.get('/api/admins/:_id', getAdmin, (req,res) => {
    if(res.user.is_admin == true) {
        res.json(res.user);
    } else {
        res.status(400).json({message: "User is not an admin"})
    }
})

router.get('/api/admins/delete/:_id', getAdmin, async (req, res) => {
    if(res.user.is_admin == true) {
        res.user.is_admin = false;
        try {
            const updatedUser = await res.user.save()
            res.status(201).json(updatedUser)
        } catch (err) {
            res.status(400).json({ message: err.message })
        }
    } else {
        res.status(400).json({message: "User is not an admin"})
    }
})

router.get('/api/admins/create/:_id', getAdmin, async (req, res) => {
    if(res.user.is_admin != true) {
        res.user.is_admin = true;
        try {
            const updatedUser = await res.user.save()
            res.status(201).json(updatedUser)
        } catch (err) {
            res.status(400).json({ message: err.message })
        }
    } else {
        res.status(400).json({message: "User is already an admin"})
    }
})

async function getAdmin(req, res, next) {
    let user
    try {
        user = await User.findById(req.params)
        if(user == null) {
            return res.status(404).json({message: 'Cannot find User'})
        }
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
    res.user = user;
    next()
}

module.exports = router;