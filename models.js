const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: { type: mongoose.Schema.Types.ObjectId, ref: 'Genre' },
  Directors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Director' }],
  Actors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Actor' }],
  ImagePath: String,
  Featured: Boolean
})

let directorSchema = mongoose.Schema({
  Name: { type: String, required: true },
  Bio: { type: String, required: true },
  DOB: Date,
  DOD: Date
})

let actorSchema = mongoose.Schema({
  Name: { type: String, required: true },
  Bio: { type: String, required: true },
  DOB: Date,
  DOD: Date
})

let genreSchema = mongoose.Schema({
  Name: { type: String, required: true },
  Description: { type: String, required: true }
})

let userSchema = mongoose.Schema({
  FirstName: { type: String, required: true },
  LastName: { type: String, required: true },
  UserName: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  DOB: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
})

userSchema.statics.hashPassword = password => {
  return bcrypt.hashSync(password, 10)
}
userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.Password)
}

let Movie = mongoose.model('Movie', movieSchema)
let Director = mongoose.model('Director', directorSchema)
let Actor = mongoose.model('Actor', actorSchema)
let Genre = mongoose.model('Genre', genreSchema)
let User = mongoose.model('User', userSchema)

module.exports = {
  Movie,
  Director,
  Actor,
  Genre,
  User
}