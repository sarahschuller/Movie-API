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
app.get('/', (req, res) =>{
  res.send('Welcome to my Horror Movie App!');
});

//Returns a list of all movies to the user
app.get('/movies', (req, res) =>{
  Movies.find()
  .then((movies) => {
    res.status(201).json(movies);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error ' + err);
  });
});

//Get movies by title
app.get('/movies/:title', (req, res) =>{
  Movies.findOne({Title: req.params.title})
  .then((movie) =>{
    res.json(movie);
  })
  .catch((err) =>{
    console.error(err);
    res.status(500).send('Error ' + err)
  });
});

//Get movies by genre
app.get('/genres/:title', (req, res) => {
  Movies.findOne({'Genre.Name': req.params.genre})
    .then((movie)=>{
        res.json(movie.Genre)
    })
    .catch((err)=>{
        console.error(err);
        res.status(500).send('Error' + err);
    });

//Get data about a director (bio, birth year, death year etc.) by name
app.get('/director/:name', (req, res) => {
  Movies.findOne({'Director.Name': req.params.directorName})
    .then((movie)=>{
        res.json(movie.Director);
    })
    .catch((err)=>{
        console.error(err);
        res.status(500).send('Error' + err);
    });
});

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

// Get User by Username
app.get('/users/:Username', (req, res) => {
  Users.findOne({ userName: req.params.Username})
  .then((user) => {
      res.json(user);
  })
  .catch((err)=>{
      console.error(err);
      res.status(500).send('Error' + error);
  });
})

// Add a user
/* 
// JSON format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
} 
*/

app.post('/users', (req, res) => {
  Users.findOne({ userName: req.body.userName })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.userName + ' Already exists');
      } else {
        Users.create({
            userName: req.body.userName,
            password: req.body.password,
            email: req.body.email,
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

//Allow users to update their user info(username)
app.put('/users/:username', (req, res) => {
  Users.findOneAndUpdate({ userName: req.params.Username}, {$set:
    {
        userName: req.body.userName,
        password: req.body.password,
        email: req.body.email,
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

//Allow users to add a movie to their list of favorites(showing only a text that a movie has been added)
app.post('/users/:username/movies/:title', (req, res) => {
  Users.findOneAndUpdate({userName: req.params.userName}, {
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

//Allow users to remove a movie from their list of favorites(showing only a text that a movie has been removed)
app.delete('/users/:username/movies/:title', (req, res) => {
  Users.findOneAndUpdate({userName: req.params.userName}, {
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
app.delete('/users/:username', (req, res) => {
  Users.findOneAndRemove({ userName: req.params.deleteUser})
    .then((user) =>{
        if (!user) {
            res.status(400).send(req.params.userName + ' was not found');
        } else {
            res.status(200).send(req.params.userName + ' was deleted');
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
