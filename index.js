const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

/* mongoose.connect('mongodb://localhost:27017/driveInDB', {
  useNewUrlParser: true, useUnifiedTopology: true
}); */

mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// logger
app.use(morgan('common'));

// import and use CORS
const cors = require('cors');

/* let allowedOrigins = [
  "http://localhost:2000/",
  "http://localhost:1234",
  "http://localhost:4200",
  "https://sarahschuller.github.io"
];
*/

app.use(cors());

// import auth.js file and pass express() to it.
let auth = require('./auth')(app);

// require passport module and import passport.js
const passport = require('passport');
require('./passport');

// import express-validator 
const {check, validationResult} = require('express-validator');

// static file response documentation.html file
app.use(express.static('public'));
app.use('/documentation.html', express.static('public/documentation.html'));

// GET REQUESTS START HERE

//Returns a generic text response to the user
app.get('/', (req, res) => {
    res.send('Welcome to my Movie App!')
}),

//Returns a list of all movies to the user
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
  .then((movies)=>{
      res.status(201).json(movies);
  })
  .catch((err)=>{
      console.error(err);
      res.status(500).send('Error' + err);
  });
});

//Get movies by title
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({Title: req.params.title})
    .then((movie)=>{
        res.json(movie);
    })
    .catch((err)=>{
        console.error(err);
        res.status(500).send('Error' + err);
    });
   });


// Get data about a genre by name.
app.get('/genres/:genre', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({'Genre.Name': req.params.genre})
    .then((movie)=>{
        res.json(movie.Genre)
    })
    .catch((err)=>{
        console.error(err);
        res.status(500).send('Error' + err);
    });
});

// Return data about director.
app.get('/directors/:directorName', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({'Director.Name': req.params.directorName})
    .then((movie)=>{
        res.json(movie.Director);
    })
    .catch((err)=>{
        console.error(err);
        res.status(500).send('Error' + err);
    });
})

//Get all users
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error' + error);
        });
});

// Find user by Username 
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOne({ Username: req.params.Username})
    .then((user) => {
        res.json(user);
    })
    .catch((err)=>{
        console.error(err);
        res.status(500).send('Error' + error);
    });
})

// Add new user
app.post('/users', [
  check('Username', 'Username is required').isLength({min: 5}),
  check('Username', 'Username contains non-alphanumeric characters, not allwed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be validated').isEmail()
], (req, res) => {
  // Check the validation object for errors
  let errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  // Hash password
  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username })
  .then((user) => {
    if (user) {
      return res.status(400).send(req.body.Username + ' already exists');
    } else {
      Users.create({
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }).then(
        (user) => { res.status(201).json(user) }
      ).catch(
        (error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
    }
  }).catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  })
});

// Allow users to update their user information
app.put('/users/:Username', [
  check('Username', 'Username is required').isLength({min: 5}),
  check('Username', 'Username contains non-alphanumeric characters, not allwed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be validated').isEmail()
],
(req, res) => {
  // Check the validation object for errors
  let errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $set:
    {
      Username: req.body.Username,
      Password: hashedPassword,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true },
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//Allow users to add a movie to their list of favorites
app.post('/users/:Username/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({Username: req.params.Username}, {
      $push: {FavoriteMovies: req.params.title}
  },
  { new: true},
 (err, updatedUser) => {
     if (err) {
         console.error(err);
         res.status(500).send('Error' + err);
     } else {
         res.json(updatedUser);
     }
 });
});

//Allow users to remove a movie from their list of favorites
app.delete('/users/:Username/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({Username: req.params.Username}, {
        $pull: {FavoriteMovies: req.params.title}
    },
    { new: true},
   (err, updatedUser) => {
       if (err) {
           console.error(err);
           res.status(500).send('Error' + err);
       } else {
           res.json(updatedUser);
       }
   });
});

//Allow existing users to delete their account (showing only a text that a user email has been removed)
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username})
  .then((user) =>{
        if (!user) {
            res.status(400).send(req.params.Username + ' was not found');
        } else {
            res.status(200).send(req.params.Username + ' was deleted');
        }
    })
  .catch((err)=>{
      console.error(err);
      res.status(500).send('Error' + err);
  });
});

//error handling middleware function
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Oops, this looks broken!');
});

//app listener
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});