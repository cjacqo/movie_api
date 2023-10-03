const mongoose = require("mongoose");
const Models = require("./models.js");
const Movies = Models.Movie;
const Genres = Models.Genre;
const Directors = Models.Director;
const Users = Models.User;

mongoose.connect(process.env.CONNECTION_URI, {
 useNewUrlParser: true,
 useUnifiedTopology: true,
});

const express = require("express"),
 app = express(),
 bodyParser = require("body-parser"),
 path = require("path"),
 morgan = require("morgan");

app.use(morgan("common"));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

const cors = require("cors");
let allowedOrigins = [
 "https://localhost:8080",
 "http://localhost:1234",
 "https://list-o-movies.netlify.app",
 "http://localhost:4200",
 "https://cjacqo.github.io"
];
app.use(
 cors({
  origin: (origin, callback) => {
   if (!origin) return callback(null, true);
   if (allowedOrigins.indexOf(origin) === -1) {
    // If a specific origin isn't found on the list of allowed origins
    let message =
     "The CORS policy for this application doesn't allow access from origin " +
     origin;
    return callback(new Error(message), false);
   }
   return callback(null, true);
  },
 })
);

let auth = require("./auth.js")(app);
const passport = require("passport");
require("./passport.js");

const { check, validationResult } = require("express-validator");

/**
 * @description Home page
 * @example
 * Authentication: None
 * @name GET /
 */
app.get("/", (req, res) => {
 res.send("Welcome to my API for movies!");
});

/**
 * @description List of users
 * @example
 * Authentication: None
 * @name GET /users
 */
app.get("/users", (req, res) => {
 Users.find()
  .then((users) => {
   res.status(201).json(users);
  })
  .catch((err) => {
   console.error(err);
   res.status(500).send("Error: " + err);
  });
});

/**
 * @description Get a user by username
 * @name GET /users/:UserName
 * @example
 * Authentication: Bearer token (JWT)
 * @example
 * Request data format
 * {
 *   "UserName": ""
 * }
 * @example
 * Response data format
 * {
 *   "_id": ObjectID,
 *   "FirstName": "",
 *   "LastName": "",
 *   "UserName": "",
 *   "Password": "",
 *   "Email": "",
 *   "DOB": "",
 *   "FavoriteMovies": [ObjectID]
 * }
 */
app.get(
 "/users/:UserName",
 passport.authenticate("jwt", { session: false }),
 (req, res) => {
  Users.findOne({ UserName: req.params.UserName })
   .then((user) => {
    res.status(200).json(user);
   })
   .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
   });
 }
);

/**
 * @description Create a user
 * @name POST /users
 * @example
 * Authentication: none
 * @example
 * Request data format
 * {
 *   "FirstName": "",
 *   "LastName": "",
 *   "UserName": "",
 *   "Password": "",
 *   "Email": "",
 *   "DOB": ""
 * }
 * @example
 * Response data format
 * {
 *   "FirstName": "",
 *   "LastName": "",
 *   "UserName": "",
 *   "Password": "",
 *   "Email": "",
 *   "DOB": "",
 *   "FavoriteMovies": [ObjectID]
 * }
 */
app.post(
 "/users",
 [
  check("UserName", "Username is required").isLength({ min: 5 }),
  check(
   "UserName",
   "Username contains non alphanumeric characters - not allowed"
  ).isAlphanumeric(),
  check("Password", "Password must be between 8 and 20 characters").isLength({
   min: 8,
   max: 20,
  }),
  check("Password", "Password is required").not().isEmpty(),
  check("Email", "Email does not appear to be valid").isEmail(),
 ],
 (req, res) => {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
   return res.status(422).json({ errors: errors.array() });
  }

  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ UserName: req.body.UserName })
   .then((user) => {
    if (user) {
     return res.status(400).send(req.body.UserName + " already exists");
    } else {
     Users.create({
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
      UserName: req.body.UserName,
      Password: hashedPassword,
      Email: req.body.Email,
      DOB: req.body.DOB,
     })
      .then((user) => {
       res.status(201).json(user);
      })
      .catch((err) => {
       console.error(err);
       console.log(req.body.FirstName);
       res.status(500).send("Error: " + err);
      });
    }
   })
   .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
   });
 }
);

/**
 * @description Update a user
 * @name PUT /users/:UserName
 * @example
 * Authentication: Bearer token (JWT)
 * Request data format
 * {
 *   "UserName": "",
 *   "Password": "",
 *   "Email": "",
 *   "Birthday": ""
 * }
 * @example
 * Response data format
 * {
 *   "_id": ObjectID,
 *   "FirstName": "",
 *   "LastName": "",
 *   "UserName": "",
 *   "Password": "",
 *   "Email": "",
 *   "DOB": "",
 *   "FavoriteMovies": [ObjectID]
 * }
 */
app.put(
 "/users/:UserName",
 passport.authenticate("jwt", { session: false }),
 // Validation logic here for request
 // *** MAKE SURE VALIDATION ONLY APPLIES TO REQUESTS/FIELDS FILLED
 [
  check(
   "UserName",
   "Username contains non alphanumeric characters - not allowed"
  ).isAlphanumeric(),
  check("UserName", "Username is required").isLength({ min: 5 }),
  check("Password", "Password must be between 8 and 20 characters").isLength({
   min: 5,
   max: 20,
  }),
  check("Password", "Password is required").not().isEmpty(),
  check("Email", "Email does not appear to be valid").isEmail(),
 ],
 (req, res) => {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
   return res.status(422).json({ errors: errors.array() });
  }

  let hashedPassword = Users.hashPassword(req.body.Password);

  Users.findOneAndUpdate(
   { UserName: req.params.UserName },
   {
    UserName: req.body.UserName,
    Password: hashedPassword,
    Email: req.body.Email,
    DOB: req.body.DOB,
   },
   { new: true }
  ) // make sure that the updated document is retured
   .then((user) => {
    res.status(200).json(user);
   })
   .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
   });
 }
);

/**
 * @description Add a movie to a user's favorite list of movies
 * @name POST /users/:UserName/movies/:MovieID
 * @example
 * Authentication: Bearer token (JWT)
 * @example
 * Request data format
 * {
 *   "UserName": "",
 *   "MovieID": ObjectID
 * }
 * @example
 * Response data format
 * {
 *   "FavoriteMovies": [ObjectID]
 * }
 */
app.post(
 "/users/:UserName/movies/:MovieID",
 passport.authenticate("jwt", { session: false }),
 (req, res) => {
  Users.findOneAndUpdate(
   { UserName: req.params.UserName },
   {
    $push: { FavoriteMovies: req.params.MovieID },
   },
   { new: true }
  )
   .then((user) => {
    res.status(200).json(user.FavoriteMovies);
   })
   .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
   });
 }
);

/**
 * @description Remove a movie from a user's favorite list of movies
 * @name DELETE /users/:UserName/movie/:MovieID
 * @example
 * Authentication: Bearer token (JWT)
 * @example
 * Request data format
 * {
 *   "UserName": "",
 *   "MovieID": ObjectID
 * }
 * @example
 * Response data format
 * {
 *   "FavoriteMovies": [ObjectID]
 * }
 */
app.delete(
 "/users/:UserName/movies/:MovieID",
 passport.authenticate("jwt", { session: false }),
 (req, res) => {
  Users.findOneAndUpdate(
   { UserName: req.params.UserName },
   {
    $pull: { FavoriteMovies: req.params.MovieID },
   },
   { new: true }
  )
   .then((user) => {
    res.status(200).json(user.FavoriteMovies);
   })
   .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
   });
 }
);

/**
 * @description Delete a user by username
 * @name DELETE /users/:UserName
 * @example
 * Authentication: Bearer token (JWT)
 * @example
 * Request data format
 * {
 *   "UserName": ""
 * }
 * @example
 * Response data format
 * none
 */
app.delete(
 "/users/:UserName",
 passport.authenticate("jwt", { session: false }),
 (req, res) => {
  Users.findOneAndRemove({ UserName: req.params.UserName })
   .then((user) => {
    if (!user) {
     res.status(400).send(req.params.UserName + " was not found");
    } else {
     res.status(200).send(req.params.UserName + " was deleted");
    }
   })
   .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
   });
 }
);

/**
 * @description Get all movies
 * @name GET /movies
 * @example
 * Authentication: Bearer token (JWT)
 * @example
 * Request data format
 * none
 * @example
 * Response data format
 * [
 *   {
 *     "_id": ObjectID,
 *     "Title": "",
 *     "Description": "",
 *     "Genre": ObjectID,
 *     "Director": [ObjectID],
 *     "Actors": [ObjectID],
 *     "ImagePath": "",
 *     "Featured": Boolean
 *   }
 * ]
 */
app.get(
 "/movies",
 passport.authenticate("jwt", { session: false }),
 (req, res) => {
  Movies.find()
   .then((movies) => {
    res.status(200).json(movies);
   })
   .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
   });
 }
);

/**
 * @description Get a movie by title
 * @name GET /movies/:Title
 * @example
 * Authentication: Bearer token (JWT)
 * @example
 * Request data format
 * none
 * @example
 * Response data format
 * {
 *   "_id": ObjectID,
 *   "Title": "",
 *   "Description": "",
 *   "Genre": ObjectID,
 *   "Director": [ObjectID],
 *   "Actors": [ObjectID],
 *   "ImagePath": "",
 *   "Featured": Boolean
 * }
 */
app.get(
 "/movies/:Title",
 passport.authenticate("jwt", { session: false }),
 (req, res) => {
  Movies.findOne({ Title: req.params.Title })
   .then((movie) => {
    res.status(200).json(movie);
   })
   .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
   });
 }
);

/**
 * @description Get all genres
 * @name GET /genres
 * @example
 * Authentication: none
 * @example
 * Request data format
 * none
 * @example
 * Request data format
 * [
 *   {
 *     "_id": ObjectID,
 *     "Name": "",
 *     "Description": ""
 *   }
 * ]
 */
app.get("/genres", (req, res) => {
 Genres.find()
  .then((genres) => {
   res.status(200).json(genres);
  })
  .catch((err) => {
   console.error(err);
   res.status(500).send("Error: " + err);
  });
});

/**
 * @description Get a genre by name
 * @name GET /genres/:Name
 * @example
 * Authentication: none
 * @example
 * Request data format
 * {
 *   "Name": ""
 * }
 * @example
 * Response data format
 * {
 *   "_id": ObjectID,
 *   "Name": "",
 *   "Description": ""
 * }
 */
app.get("/genres/:Name", (req, res) => {
 Genres.findOne({ Name: req.params.Name })
  .then((genre) => {
   res.status(200).json(genre);
  })
  .catch((err) => {
   console.error(err);
   res.status(500).send("Error: " + err);
  });
});

/**
 * @description Get all directors
 * @name GET /directors
 * @example
 * Authentication: none
 * @example
 * Request data format
 * none
 * @example
 * Response data format
 * [
 *  {
 *     "_id": ObjectID,
 *     "Name": "",
 *     "Bio": "",
 *     "DOB": Date
 *  } 
 * ]
 */
app.get("/directors", (req, res) => {
 Directors.find()
  .then((directors) => {
   res.status(200).json(directors);
  })
  .catch((err) => {
   console.error(err);
   res.status(500).send("Error: " + err);
  });
});

/**
 * @description Get a director by name
 * @name GET /directors/:Name
 * @example
 * Authentication: none
 * @example
 * Request data format
 * {
 *   "Name": ""
 * }
 * @example
 * Response data format
 * {
 *   "_id": ObjectID,
 *   "Name": "",
 *   "Bio": "",
 *   "DOB": Date
 * }
 */
app.get("/directors/:Name", (req, res) => {
 Directors.findOne({ Name: req.params.Name })
  .then((director) => {
   res.status(200).json(director);
  })
  .catch((err) => {
   console.error(err);
   res.status(500).send("Error: " + err);
  });
});

/**
 * Link to documentation of API
 */
app.get("/documentation", (req, res) => {
 res.sendFile("/documentation.html");
});

app.use((err, req, res, next) => {
 console.error(err.stack);
 res.status(500).send("Something broke! " + err);
});

const port = process.env.PORT || 8080;

app.listen(port, "0.0.0.0", () => {
 console.log("Listening on Port: " + port);
});