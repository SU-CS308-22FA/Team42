/**
 * Search the class objects in the system
 * @author Ruslan Gaynullin <ruslang@sabanciuniv.edu>
 * @param {JSON} req - Incoming request
 * @param {JSON} res - Respond with the res object
 * Find the objects in the database in three different classes [teams, users, competitions] 
   by sending the request to the MongoDB database which outputs the result
   
 * https://cs308-db.herokuapp.com/?search=keyword
 */


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


/**
 * getTeam function which searches for a team with a unique id
 * @author Ruslan Gaynullin <ruslang@sabanciuniv.edu>
 * @param {JSON} req - Incoming request
 * @param {JSON} res - Respond with the res object
 * @param {} next - execute the other middleware functions succeeding the current middleware
 * Find the team object with a unique id that is passed with a req.params.
 */

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
