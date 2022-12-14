const Express = require('express');
const router = Express();
const Team = require('../models/team')
const User = require('../models/user')
const Competition = require('../models/competition')

var collection;

router.get('/', async (req, res) => {
    const search = req.query.search;
    try {
        let teams = await Team.aggregate([
            {
              $search: {
                text: {
                  query: search,
                  path: {
                    'wildcard': '*'
                  },
                  fuzzy: {
                    'maxEdits': 1                  
                  }
                }
              }
            }, {
                '$limit': 2
              }
          ])
          let users = await User.aggregate([
            {
              $search: {
                text: {
                  query: search,
                  path: {
                    'wildcard': '*'
                  },
                  fuzzy: {
                    'maxEdits': 1                  
                  }
                }
              }
            }, {
                '$limit': 2
              }
          ])
          let competitions = await Competition.aggregate([
            {
              $search: {
                text: {
                  query: search,
                  path: {
                    'wildcard': '*'
                  },
                  fuzzy: {
                    'maxEdits': 1                  
                  }
                }
              }
            }, {
                '$limit': 2
              }
          ])
          return res.status(200).json({
            statusCode: 200,
            message: 'Fetched posts',
            data: { teams, users, competitions },
          });
    } catch (e) {
        res.status(500).send({message: e.message});
    }
  });  

  module.exports = router;