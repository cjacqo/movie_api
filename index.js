const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      uuid = require('uuid')
      morgan = require('morgan')

let movies = [
  {
    "Title": "The Godfather",
    "Description": "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    "ImageURL": "https://www.example.com/the-godfather.jpg",
    "Genre": {
      "Name": "Crime",
      "Description": "Crime films are those that focus on the lives of criminals. They may involve bank robbers, jewel thieves, or organized crime. Crime films often highlight the rise and fall of power, authority, and criminal influence."
    },
    "Directors": [
      {
        "Name": "Francis Ford Coppola",
        "Bio": "Francis Ford Coppola is an American film director, producer, and screenwriter. He is widely regarded as one of the greatest directors of all time.",
        "Birth": 1939,
        "Death": null
      }
    ]
  },
  {
    "Title": "The Shawshank Redemption",
    "Description": "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    "ImageURL": "https://www.example.com/the-shawshank-redemption.jpg",
    "Genre": {
      "Name": "Drama",
      "Description": "Drama films are those that focus on serious or important issues, often involving emotional themes such as loss, love, or betrayal. They often have a strong storyline, complex characters, and realistic dialogue."
    },
    "Directors": [
      {
        "Name": "Frank Darabont",
        "Bio": "Frank Darabont is an American film director, screenwriter, and producer. He is best known for his work on The Shawshank Redemption, The Green Mile, and The Walking Dead.",
        "Birth": 1959,
        "Death": null
      }
    ]
  },
  {
    "Title": "The Dark Knight",
    "Description": "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    "ImageURL": "https://www.example.com/the-dark-knight.jpg",
    "Genre": {
      "Name": "Action",
      "Description": "Action films are those that focus on physical action or intense excitement, often involving chase scenes, fights, or explosions. They often have a simple plot, with the emphasis on spectacle and excitement."
    },
    "Directors": [
      {
        "Name": "Christopher Nolan",
        "Bio": "Christopher Nolan is a British-American film director, screenwriter, and producer. He is known for his work on The Dark Knight Trilogy, Inception, and Interstellar.",
        "Birth": 1970,
        "Death": null
      }
    ]
  },
  {
    "Title": "Pulp Fiction",
    "Description": "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    "ImageURL": "https://www.example.com/pulp-fiction.jpg",
    "Genre": {
      "Name": "Crime",
      "Description": "Crime films are those that focus on the lives of criminals. They may involve bank robbers, jewel thieves, or organized crime. Crime films often highlight the rise and fall of power, authority, and criminal influence."
    },
    "Directors": [
      {
        "Name": "Quentin Tarantino",
        "Bio": "Quentin Tarantino is an American film director, screenwriter, producer, and actor. He is known for his nonlinear storytelling, stylized violence, and genre-bending films.",
        "Birth": 1963,
        "Death": null
      }
    ]
  },
  {
    "Title": "Everything Everywhere All at Once",
    "Description": "A woman discovers she has the ability to communicate with alternate versions of herself across multiple universes. As she learns more about her powers, she must choose whether to use them for personal gain or to fight for the greater good.",
    "ImageURL": "https://www.example.com/everything-everywhere-all-at-once.jpg",
    "Genre": {
      "Name": "Science Fiction",
      "Description": "Science fiction films are those that explore the potential consequences of scientific, social, and other innovations. These films often imagine new worlds and alternate realities, and may involve futuristic technology or dystopian societies."
    },
    "Directors": [
      {
        "Name": "Dan Kwan",
        "Bio": "Dan Kwan is an American film director and writer. He is best known for his work on the film Swiss Army Man, which he co-directed with Daniel Scheinert.",
        "Birth": 1983,
        "Death": null
      },
      {
        "Name": "Daniel Scheinert",
        "Bio": "Daniel Scheinert is an American film director, writer, and editor. He is best known for his work on the film Swiss Army Man, which he co-directed with Dan Kwan.",
        "Birth": 1987,
        "Death": null
      }
    ]
  },
  {
    "Title": "Being John Malkovich",
    "Description": "A puppeteer discovers a portal that leads into the mind of actor John Malkovich. As he explores Malkovich's mind, he and others become obsessed with the experience and its possibilities.",
    "ImageURL": "https://www.example.com/being-john-malkovich.jpg",
    "Genre": {
      "Name": "Fantasy",
      "Description": "Fantasy films are those that often include magical or supernatural elements, often involving mythical creatures or events. These films may take place in entirely imaginary worlds, or they may involve elements of our own world imbued with a sense of wonder and magic."
    },
    "Directors": [
      {
        "Name": "Spike Jonze",
        "Bio": "Spike Jonze is an American filmmaker, photographer, and actor. He is best known for his work as a director, having helmed such films as Being John Malkovich, Adaptation, and Her.",
        "Birth": 1969,
        "Death": null
      }
    ]
  },
  {
    "Title": "Eternal Sunshine of the Spotless Mind",
    "Description": "A man discovers that his ex-girlfriend has had him erased from her memory, so he decides to undergo the same procedure. As he relives their relationship in his mind, he begins to question whether he wants to forget her after all.",
    "ImageURL": "https://www.example.com/eternal-sunshine-of-the-spotless-mind.jpg",
    "Genre": {
      "Name": "Drama",
      "Description": "Drama films are those that explore serious or emotional themes, often dealing with human relationships and personal struggles. These films may be set in the present day or in the past, and may involve characters from all walks of life."
    },
    "Directors": [
      {
        "Name": "Michel Gondry",
        "Bio": "Michel Gondry is a French film director, screenwriter, and producer. He is known for his distinctive visual style, which often involves the use of practical effects and creative editing techniques.",
        "Birth": 1963,
        "Death": null
      }
    ]
  },
  {
    "Title": "Stand by Me",
    "Description": "Four friends set out on a journey to find a dead body in the woods. Along the way, they confront their fears and learn about themselves and each other.",
    "ImageURL": "https://www.example.com/stand-by-me.jpg",
    "Genre": {
      "Name": "Drama",
      "Description": "Drama films are those that explore serious or emotional themes, often dealing with human relationships and personal struggles. These films may be set in the present day or in the past, and may involve characters from all walks of life."
    },
    "Directors": [
      {
        "Name": "Rob Reiner",
        "Bio": "Rob Reiner is an American actor, comedian, and filmmaker. He is best known for his work as a director, having helmed such films as This Is Spinal Tap, The Princess Bride, and A Few Good Men.",
        "Birth": 1947,
        "Death": null
      }
    ]
  },
  {
    "Title": "Moonrise Kingdom",
    "Description": "Two young lovers run away together and spark a search party across their small island town. As they evade their pursuers and try to build a life for themselves in the wilderness, they learn about love, sacrifice, and growing up.",
    "ImageURL": "https://www.example.com/moonrise-kingdom.jpg",
    "Genre": {
      "Name": "Comedy-drama",
      "Description": "Comedy-drama is a genre that blends elements of comedy and drama to create a story that is both humorous and emotionally resonant. These films often deal with complex human relationships and personal struggles, while also incorporating moments of levity and humor."
    },
    "Directors": [
      {
        "Name": "Wes Anderson",
        "Bio": "Wes Anderson is an American film director, producer, and screenwriter. He is known for his distinctive visual style, which often features highly stylized set designs, quirky characters, and a dry sense of humor.",
        "Birth": 1969,
        "Death": null
      }
    ]
  },
  {
    "Title": "Little Miss Sunshine",
    "Description": "A dysfunctional family takes a cross-country road trip to support their young daughter as she competes in a beauty pageant. Along the way, they confront their personal problems and learn to support one another.",
    "ImageURL": "https://www.example.com/little-miss-sunshine.jpg",
    "Genre": {
      "Name": "Comedy-drama",
      "Description": "Comedy-drama is a genre that blends elements of comedy and drama to create a story that is both humorous and emotionally resonant. These films often deal with complex human relationships and personal struggles, while also incorporating moments of levity and humor."
    },
    "Directors": [
      {
        "Name": "Jonathan Dayton",
        "Bio": "Jonathan Dayton is an American film director and producer. He is known for his work with his wife and producing partner Valerie Faris, with whom he has directed music videos, commercials, and feature films.",
        "Birth": 1957,
        "Death": null
      },
      {
        "Name": "Valerie Faris",
        "Bio": "Valerie Faris is an American film director and producer. She is known for her work with her husband and producing partner Jonathan Dayton, with whom she has directed music videos, commercials, and feature films.",
        "Birth": 1958,
        "Death": null
      }
    ]
  },
  {
    "Title": "In Bruges",
    "Description": "After a job goes wrong, two hitmen are sent to Bruges, Belgium to await further instructions from their boss. While there, they experience the local culture and reflect on their own lives, leading to unexpected and violent consequences.",
    "ImageURL": "https://www.example.com/in-bruges.jpg",
    "Genre": {
      "Name": "Crime-drama",
      "Description": "Crime-drama is a genre that blends elements of crime and drama to create a story that is both suspenseful and emotionally resonant. These films often deal with complex moral issues and the consequences of criminal activity, while also incorporating moments of tension and suspense."
    },
    "Directors": [
      {
        "Name": "Martin McDonagh",
        "Bio": "Martin McDonagh is a British-Irish playwright, screenwriter, and film director. He is known for his darkly comedic writing style and his exploration of themes related to violence, morality, and justice.",
        "Birth": 1970,
        "Death": null
      }
    ]
  }
]

let users = [
  {
    "id": 1,
    "username": "johndoe",
    "favorite_movies": [
      "Pulp Fiction",
      "Eternal Sunshine of the Spotless Mind",
      "Stand by Me",
      "Little Miss Sunshine",
      "Everything Everywhere All at Once"
    ]
  },
  {
    "id": 2,
    "username": "janedoe",
    "favorite_movies": [
      "The Godfather",
      "Moonrise Kingdom",
      "In Bruges",
      "Being John Malkovich",
      "Pulp Fiction"
    ]
  }
]

app.use(morgan('common'))
app.use('/', express.static('public'))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Welcome to my API for movies!')
})

// CREATE
app.post('/users', (req, res) => {
  const newUser = req.body

  if (newUser.username) {
    const userNameExists = users.find(user => user.username === newUser.username)
    if (userNameExists) {
      res.status(400).send(`User name already exists`)
    } else {
      newUser.id = uuid.v4()
      users.push(newUser)
      res.status(201).json(newUser)
    }
  } else {
    res.status(400).send('Users need usernames')
  }
})

// UPDATE
app.put('/users/:id', (req, res) => {
  const { id } = req.params
  const updatedUser = req.body

  let user = users.find(user => user.id == id)

  if (user) {
    user.username = updatedUser.username
    res.status(200).json(user)
  } else {
    res.status(400).send('User does not exist')
  }
})

// CREATE
app.post('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params

  let user = users.find(user => user.id == id)

  if (user) {
    user.favorite_movies.push(movieTitle) 
    res.status(200).send(`${movieTitle} has been added to user ${id}'s array`)
  } else {
    res.status(400).send('No user exists')
  }
})

// DELETE
app.delete('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params

  let user = users.find(user => user.id == id)

  if (user) {
    user.favorite_movies = user.favorite_movies.filter(title => title !== movieTitle) 
    res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`)
  } else {
    res.status(400).send('No user exists')
  }
})

// DELETE
app.delete('/users/:id', (req, res) => {
  const { id } = req.params

  let user = users.find(user => user.id == id)

  if (user) {
    users = users.filter(user => user.id != id)
    res.status(200).send(`User with id ${id} has been deleted`)
  } else {
    res.status(400).send('No user exists')
  }
})

// READ
app.get('/movies', (req, res) => {
  res.status(200).json(movies)
})

// READ
app.get('/movies/:title', (req, res) => {
  const { title } = req.params
  const movie = movies.find(movie => movie.Title === title)

  if (movie) {
    res.status(200).json(movie)
  } else {
    res.status(400).send(`No movie found with title ${title}`)
  }
})

// READ
app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params
  const genre = movies.find(movie => movie.Genre.Name === genreName).Genre

  if (genre) {
    res.status(200).json(genre)
  } else {
    res.status(400).send(`No genre found with name ${genreName}`)
  }
})

// READ
app.get('/movies/directors/:directorName', (req, res) => {
  const { directorName } = req.params
  const director = movies.flatMap(movie => movie.Directors).find(director => director.Name === directorName)

  if (director) {
    res.status(200).json(director)
  } else {
    res.status(400).send(`No director found with name ${director}`)
  }
})

// READ
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