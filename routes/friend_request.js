const { Router } = require('express');
const router = Router();
var crypto = require('crypto');
const Competition = require('../models/competition')
const { appendFile } = require('fs');
var session = require('express-session');
const Friends = require('../models/friends')
const User = require('../models/user')

router.get('/api/friend_requests/', getAll, async (req,res) => {
    res.json(res.allrequests)
});

router.get('/api/friend_requests/:_id', getUser, async (req,res) => {
    res.json(res.user)
});

router.post('/api/friend_requests/create', getAll, async (req,res) => {
    const {requester, recipient, status} = req.body;
    console.log(req.body);
    const newRequest = new Friends({
        requester: requester,
        recipient: recipient,
        created_at: new Date,
        modified_at: new Date,
    })
    try {
        const newFriendRequest = await newRequest.save()
        res.status(201).json(newFriendRequest)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
    //res.json(res.friendRequest)
});

router.post('/api/friend/myrequests', getAll, async (req,res) => {
    const empty = []
    if(res.allrequests.find(e => e.requester === req.body.requester)) {
        const myrequests = res.allrequests.find(e => e.requester === req.body.requester)
        return res.status(200).json({
            statusCode: 200,
            message: 'You are requesting friendship to these users',
            data: { myrequests },
        });
        res.json(res.allrequests)
    } else {
        return res.status(200).json({
            statusCode: 200,
            message: 'No requests found',
            data: { empty },
        });
    }
});

router.post('/api/friend/requeststome', getAll, async (req,res) => {
    const empty = []
    if(res.allrequests.find(e => e.recipient === req.body.recipient)) {
        requesttome = res.allrequests.find(e => e.recipient === req.body.recipient)
        res.status(200).json({
            statusCode: 200,
            message: 'Requests to you',
            data: { requesttome },
        });
    } else {
        res.status(200).json({
            statusCode: 200,
            message: 'No requests found',
            data: { empty },
        });
    }
});

router.delete('/api/delete_requests/:_id', getUser, async (req,res) => {
    try {
        await res.user.remove()
        res.json({ message: "Deleted Request"})
    } catch(err) {
        res.status(500).json({message: err.message})
    }
});

async function getUser(req, res, next) {
    let user
    try {
        user = await Friends.findById(req.params)
        if(user == null) {
            return res.status(404).json({message: 'Cannot find the Request'})
        }
    } catch (err) {
        return res.status(500).json({message: err.message})
    }

    res.user = user
    next()
}


async function getAll(req, res, next) {
    let allrequests
    try {
        allrequests = await Friends.find()
        if(allrequests == null) {
            return res.status(404).json({message: 'No friend Requests'})
        }
    } catch (err) {
        return res.status(500).json({message: err.message})
    }

    res.allrequests = allrequests
    next()
}


module.exports = router;
