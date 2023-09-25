const jwtSecret = 'your_jwt_secret' // This HAS to be the same key used in the JWTStrategy (passport.js)

const jwt = require('jsonwebtoken'),
      passport = require('passport')

require('./passport.js')

/**
 * Generate a JSON Web Token
 * @param {object} user 
 * @returns JSON Web Token
 */
let generateJWTToken = user => {
  return jwt.sign(user, jwtSecret, {
    subject: user.UserName,   // The username you're encoding in the JWT
    expiresIn: '7d',          // This specifies that the token will expire in 7 days
    algorithm: 'HS256'        // This is the algorithm used to 'sign' or encode the values of the JWT
  })
}

/* POST login. */
module.exports = router => {
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err || !user) {
        console.log(err)
        console.log(user)
        return res.status(400).json({
          message: 'Something is not right',
          user
        })
      }
      req.login(user, { session: false }, err => {
        if (err) res.send(err)
        let token = generateJWTToken(user.toJSON())
        return res.json({ user, token })
      })
    })(req, res)
  })
}