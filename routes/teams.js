const { Router } = require('express');
const router = Router();
var crypto = require('crypto');
const Team = require('../models/team')
const { appendFile } = require('fs');
var session = require('express-session');

router.use(session({secret:"minu238g02839ji4jijn3928", resave:false,saveUninitialized:true}));

router.get('/api/teams', async (req,res) => {
    try {
        const teams = await Team.find()
        res.json(teams)
    } catch(err) {
        res.status(500).json({ message: err.message })
    }
});

router.get('/api/teams/:_id', getUser, (req,res) => {
    res.json(res.team);
})

router.post('/api/teams/register', async (req,res) => {
    const {team_id, team_name, lineup} = req.body;
    console.log(req.body);
    const team = new Team({
        team_id: team_id,
        team_name: team_name,
        lineup: lineup,
        created_at: new Date,
        modified_at: new Date,
    })
    try {
        const newTeam = await team.save()
        res.status(201).json(newTeam)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
});

router.delete('/api/teams/delete/:_id', getUser, async (req, res) => {
    try {
        await res.team.remove()
        res.json({ message: "Deleted Team"})
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})


async function getUser(req, res, next) {
    let team
    try {
        team = await Team.findById(req.params)
        if(team == null) {
            return res.status(404).json({message: 'Cannot find Team'})
        }
    } catch (err) {
        return res.status(500).json({message: err.message})
    }

    res.team = team
    next()
}

module.exports = router;