const { Router } = require('express');
const router = Router();
var crypto = require('crypto');
const Competition = require('../models/competition')
const { appendFile } = require('fs');
var session = require('express-session');

router.use(session({secret:"minu238g02839ji4jijn3928", resave:false,saveUninitialized:true}));

router.get('/api/competition', async (req,res) => {
    try {
        const competitions = await Competition.find()
        res.json(competitions)
    } catch(err) {
        res.status(500).json({ message: err.message })
    }
});

router.get('/api/competition/:_id', getUser, (req,res) => {
    res.json(res.competition);
})

router.post('/api/competition/register', async (req,res) => {
    const {competition_id, season_id, competition_name, competition_gender, competition_youth, season_name, competition_start, competition_end} = req.body;
    console.log(req.body);
    const competition = new Competition({
        competition_id: competition_id,
        season_id: season_id,
        competition_name: competition_name,
        competition_gender: competition_gender,
        competition_youth: competition_youth,
        season_name: season_name,
        competition_start: competition_start,
        competition_end: competition_end,
        created_at: new Date,
        modified_at: new Date,
    })
    try {
        const newCompetition = await competition.save()
        res.status(201).json(newCompetition)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
});

router.delete('/api/competition/delete/:_id', getUser, async (req, res) => {
    try {
        await res.competition.remove()
        res.json({ message: "Deleted Competition"})
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

router.put('/api/competition/update/:_id', getUser, async (req, res) => {
    if(req.body.competition_id != null) {
        res.competition.competition_id = req.body.competition_id
    } if(req.body.season_id != null) {
        res.competition.season_id = req.body.season_id
    } if(req.body.competition_name != null) {
        res.competition.competition_name = req.body.competition_name
    } if(req.body.competition_gender != null) {
        res.competition.competition_gender = req.body.competition_gender
    } if(req.body.competition_youth != null) {
        res.competition.competition_youth = req.body.competition_youth
    } if(req.body.season_name != null) {
        res.competition.season_name = req.body.season_name
    } if(req.body.competition_start != null) {
        res.competition.competition_start = req.body.competition_start
    } if(req.body.competition_end != null) {
        res.competition.competition_end = req.body.competition_end
    }
    try {
        const updatedCompetition = await res.competition.save()
        res.competition.modified_at = new Date
        res.json(updatedCompetition)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})


async function getUser(req, res, next) {
    let competition
    try {
        competition = await Competition.findById(req.params)
        if(competition == null) {
            return res.status(404).json({message: 'Cannot find Competition'})
        }
    } catch (err) {
        return res.status(500).json({message: err.message})
    }

    res.competition = competition
    next()
}

module.exports = router;