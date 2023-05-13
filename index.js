const express = require('express')
const app = express(),
      morgan = require('morgan')

let topMovies = [
  {
    title: 'In Bruges',
    directors: [ 'Martin McDonagh' ]
  },
  {
    title: 'Everything Everywhere All at Once',
    directors: [ 'Daniel Kwan', 'Daniel Scheinert' ]
  },
  {
    title: 'Being John Malkovich',
    directors: [ 'Spike Jonze' ]
  },
  {
    title: 'Eternal Sunshine of the Spotless Mind',
    directors: [ 'Michael Gondry' ]
  },
  {
    title: 'Goodfellas',
    directors: [ 'Martin Scorsese' ]
  },
  {
    title: 'Little Miss Sunshine',
    directors: [ 'Valerie Faris', 'Jonathan Dayton' ]
  },
  {
    title: 'Moonrise Kingdom',
    directors: [ 'Wes Anderson' ]
  },
  {
    title: 'Pulp Fiction',
    directors: [ 'Quentin Tarantino' ]
  },
  {
    title: 'Django Unchained',
    directors: [ 'Quentin Tarantino' ]
  },
  {
    title: 'Stand by Me',
    directors: [ 'Rob Reiner' ]
  }
]

app.use(morgan('common'))
app.use('/', express.static('public'))

app.get('/', (req, res) => {
  res.send('Welcome to a list of my favorite movies!')
})

app.get('/movies', (req, res) => {
  res.json(topMovies)
})

app.get('/documentation', (req, res) => {
  res.sendFile('documentation.html')
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(8080, () => {
  console.log('App is running on port 8080')
})