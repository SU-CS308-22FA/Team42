const { Router } = require('express');
const router = Router();
var crypto = require('crypto');
const Team = require('../models/team')
const User = require('../models/user')
const { appendFile } = require('fs');
var session = require('express-session');
const user = require('../models/user');

router.use(session({secret:"minu238g02839ji4jijn3928", resave:false,saveUninitialized:true}));

router.get('/api/teams', async (req,res) => {
    try {
        const teams = await Team.find()
        res.json(teams)
    } catch(err) {
        res.status(500).json({ message: err.message })
    }
});

router.get('/api/teams/:_id', getTeam, (req,res) => {
    res.json(res.team);
})

//register a new team
router.post('/api/teams/register/:user_id', getUser, async (req,res) => {
    if(res.user.in_team == false) {
        const {team_id, team_name, lineup} = req.body;
        lineup['user_id'] = res.user._id;
        lineup['player_name'] = res.user.fullname;
        lineup['owner'] = true;

        res.user.in_team = true;
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
            const updatedUser = await res.user.save()
            res.status(201).json(newTeam)
        } catch (err) {
            res.status(400).json({ message: err.message })
        }
    } else {
        res.status(400).json({ message: "User is already in some team" })
    }
});

// Adding a user into the team
router.put('/api/teams/register/player/:team_id/:user_id', getTeamUser, getUser, async (req,res) => {
    if(!res.team.lineup.find(e => e.user_id === req.params.user_id)) {
        if(res.user.in_team == false) {
            lineup = req.body.lineup;
            lineup['user_id'] = res.user._id;
            lineup['player_name'] = res.user.fullname;
            lineup['owner'] = false;
            res.team.lineup.push(lineup)
            res.user.in_team = true;
            const updatedTeam = await res.team.save()
            const updatedUser = await res.user.save()
            res.team.modified_at = new Date
            res.json(updatedTeam)
        } else {
            res.status(400).json({ message: "User is already in some team" })
        }
    } else {
        res.status(400).json({ message: "User is already in the selected team" })
    }
})

// Delete user from a team
router.put('/api/teams/delete/player/:team_id/:user_id', getTeamUser, getUser, async (req,res) => {
    if(res.team.lineup.find(e => e.user_id === req.params.user_id)) {
        res.team.lineup = res.team.lineup.filter(v => v.user_id !== req.params.user_id)
        const updatedTeam = await res.team.save()
        res.team.modified_at = new Date
        res.user.in_team = true;
        const updatedUser = await res.user.save()
        res.json(updatedTeam)
    } else {
        res.status(400).json({message: "User not in the team"})
    }
})


router.delete('/api/teams/delete/:_id', getTeam, async (req, res) => {
    if(res.team.lineup != null) {
        for (let i = 0, len = res.team.lineup.length; i < len; i++) {
            User.findByIdAndUpdate(res.team.lineup[i].user_id, { in_team: false },
            function (err, docs) {
                if (err){
                    console.log(err)
                }
                else{
                    console.log("Updated User : ", docs);
                }
            });
        }
        try {
            await res.team.remove()
            res.json({ message: "Deleted Team"})
        } catch(err) {
            res.status(500).json({message: err.message})
        }
    } else {
        res.status(400).json({message: "The team is empty or does not exist!"})
    }
})

async function getTeam(req, res, next) {
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

async function getTeamUser(req, res, next) {
    let team
    try {
        team = await Team.findById(req.params.team_id)
        if(team == null) {
            return res.status(404).json({message: 'Cannot find Team'})
        }
    } catch (err) {
        return res.status(500).json({message: 'Team not found'})
    }

    res.team = team
    next()
}

async function getUser(req, res, next) {
    let user
    try {
        user = await User.findById(req.params.user_id)
        if(user == null) {
            return res.status(404).json({message: 'Such a user doesnt exist'})
        }
    } catch (err) {
        return res.status(500).json({message: err.message})
    }

    res.user = user
    next()
}

module.exports = router;