const mongoose = require('mongoose')
const Models = require('./models.js')
const Movies = Models.Movie
const Genres = Models.Genre
const Directors = Models.Director
const Users = Models.User

mongoose.connect('mongodb://localhost:27017/moviesapiDB', { useNewUrlParser: true, useUnifiedTopology: true })

const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      path = require('path'),
      morgan = require('morgan')

app.use(morgan('common'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))

let auth = require('./auth.js')(app)
const passport = require('passport')
require('./passport.js')

app.get('/', (req, res) => {
  res.send('Welcome to my API for movies!')
})

// READ - Mongoose
// - all users
app.get('/users', (req, res) => {
  Users.find()
    .then(users => {
      res.status(201).json(users)
    })
    .catch(err => {
      console.error(err)
      res.status(500).send('Error: ' + err)
    })
})

// READ - Mongoose
// - user by username
app.get('/users/:UserName', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ UserName: req.params.UserName })
    .then(user => {
      res.status(200).json(user)
    })
    .catch(err => {
      console.error(err)
      res.status(500).send('Error: ' + err)
    })
})

// CREATE - Mongoose
// - a user
app.post('/users', (req, res) => {
  Users.findOne({ UserName: req.body.UserName })
    .then(user => {
      if (user) {
        return res.status(400).send(req.body.UserName + 'already exists')
      } else {
        Users.create({
          FirstName: req.body.FirstName,
          LastName: req.body.LastName,
          UserName: req.body.UserName,
          Password: req.body.Password,
          Email: req.body.Email,
          DOB: req.body.DOB
        })
        .then(user => { res.status(201).json(user) })
        .catch(err => {
          console.error(err)
          console.log(req.body.FirstName)
          res.status(500).send('Error: ' + err)
        })
      }
    })
    .catch(err => {
      console.error(err)
      res.status(500).send('Error: ' + err)
    })
})

// UPDATE - Mongoos
// - user by username
app.put('/users/:UserName', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ UserName: req.params.UserName },
  {
    UserName: req.body.UserName,
    Password: req.body.Password,
    Email: req.body.Email,
    DOB: req.body.DOB
  },
  { new: true }) // make sure that the updated document is retured
  .then(user => {
    res.status(200).send(`Successfully updated ${user.UserName}`)
  })
  .catch(err => {
    console.error(err)
    res.status(500).send('Error: ' + err)
  })
})

// UPDATE - Mongoose
// - add a movie to user's list of favorites
app.post('/users/:UserName/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ UserName: req.params.UserName }, {
    $push: { FavoriteMovies: req.params.MovieID }
  },
  { new: true })
  .then(user => {
    res.status(200).send('New movie has been added to favorites')
  })
  .catch(err => {
    console.error(err)
    res.status(500).send('Error: ' + err)
  })
})

// DELETE - Mongoose
// - remove a movie from a user's list of favorites
app.delete('/users/:UserName/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ UserName: req.params.UserName }, {
    $pull: { FavoriteMovies: req.params.MovieID }
  },
  { new: true })
  .then(user => {
    res.status(200).send('Movie has been removed from list of favorites')
  })
  .catch(err => {
    console.error(err)
    res.status(500).send('Error: ' + err)
  })
})

// DELETE - Mongoose
// - remove a user by username
app.delete('/users/:UserName', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ UserName: req.params.UserName })
    .then(user => {
      if (!user) {
        res.status(400).send(req.params.UserName + ' was not found')
      } else {
        res.status(200).send(req.params.UserName + ' was deleted')
      }
    })
    .catch(err => {
      console.error(err)
      res.status(500).send('Error: ' + err)
    })
})

// READ - Mongoose
// - all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
    .then(movies => {
      res.status(200).json(movies)
    })
    .catch(err => {
      console.error(err)
      res.status(500).send('Error: ' + err)
    })
})

// READ - Mongoose
// - movies by title
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then(movie => {
      res.status(200).json(movie)
    })
    .catch(err => {
      console.error(err)
      res.status(500).send('Error: ' + err)
    })
})

// READ - Mongoose
// - all genres
app.get('/genres', passport.authenticate('jwt', { session: false }), (req, res) => {
  Genres.find()
    .then(genres => {
      res.status(200).json(genres)
    })
    .catch(err => {
      console.error(err)
      res.status(500).send('Error: ' + err)
    })
})

// READ - Mongoose
// - genre by name
app.get('/genres/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Genres.findOne({ Name: req.params.Name })
    .then(genre => {
      res.status(200).json(genre)
    })
    .catch(err => {
      console.error(err)
      res.status(500).send('Error: ' + err)
    })
})

// READ - Mongoose
// - all directors
app.get('/directors', passport.authenticate('jwt', { session: false }), (req, res) => {
  Directors.find()
    .then(directors => {
      res.status(200).json(directors)
    })
    .catch(err => {
      console.error(err)
      res.status(500).send('Error: ' + err)
    })
})

// READ - Mongoose
// - director by name
app.get('/directors/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Directors.findOne({ Name: req.params.Name })
    .then(director => {
      res.status(200).json(director)
    })
    .catch(err => {
      console.error(err)
      res.status(500).send('Error: ' + err)
    })
})

// READ
app.get('/documentation', (req, res) => {
  res.sendFile('documentation.html')
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke! ' + err)
})

app.listen(8080, () => {
  console.log('App is running on port 8080')
})