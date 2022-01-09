// Require mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/movies', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// import models.js file & the movie & user models
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;

const express = require('express'); //load express module
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

//initialize and use morgan app
const morgan = require('morgan');
app.use(morgan('common'));


//Returns a generic text response to the user
app.get('/', (req, res) => {
    res.send('Welcome to my Movie App!')
}),

//Returns a list of all movies to the user
app.get('/movies', (req, res) => {
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
app.get('/movies/:title', (req, res) => {
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
app.get('/genres/:genre', (req, res) => {
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
app.get('/directors/:directorName', (req, res) => {
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
app.get('/users', (req, res) => {
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
app.get('/users/:Username', (req, res) => {
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
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + ' Already exists');
      } else {
        Users.create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Allow users to update their user information
app.put('/users/:Username', (req, res) => {
   Users.findOneAndUpdate({ Username: req.params.Username}, {$set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
},
{ new: true},
(err, updatedUser) => {
    if(err) {
        console.error(err);
        res.status(500).send('Error' + err);
    } else {
        res.json(updatedUser);
    }
    });
});

//Allow users to add a movie to their list of favorites
app.post('/users/:Username/movies/:title', (req, res) => {
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
app.delete('/users/:Username/movies/:title', (req, res) => {
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
app.delete('/users/:Username', (req, res) => {
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


app.use(express.static('public', {
  extensions:['html'],
}));

//error handling middleware function
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Oops, this looks broken!');
});

//app listener
app.listen(8080, () => {
  console.log('This app is listening on port 8080.');
});