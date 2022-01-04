// Require mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/myFlixDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});mon

// import models.js file & the movie & user models
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;

const express = require('express'); //load express module
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

//initialize and use morgan app
const morgan = require('morgan');
const bodyParser = require('body-parser');
app.use(morgan('common'));



//Returns a list of all movies to the user
app.get('/movies', (req, res) =>{
  res.json(movies);
});

//Returns a generic text response to the user
app.get('/', (req, res) =>{
  res.send('Welcome to my Horror Movie App!');
});

//Get movies by title
app.get('/movies/:title', (req, res) =>{
  res.send('Movies by Title');
});

//Get movies by year
app.get('/movies/:year',(req, res) => {
  res.send('Movies by year');
});

//Get movies by genre
app.get('/genres/:title', (req, res) => {
  res.send('Genres by title')
});

//Get data about a director (bio, birth year, death year etc.) by name
app.get('/directors/:name', (req, res) => {
  res.send('Data about the director by name');
});

//Allow new users to register
app.post('/users', (req, res) => {
  res.send('New user has been registered');
});

//Allow users to update their user info(username)
app.put('/users/:username', (req, res) => {
  res.send('User information has been updated');
});

//Allow users to add a movie to their list of favorites(showing only a text that a movie has been added)
app.post ('/users/:username/movies/:movieId', (req, res) => {
  res.send('Movie has been added to user favorites');
});

//Allow users to remove a movie from their list of favorites(showing only a text that a movie has been removed)
app.delete('/users/:username/movies/:movieId', (req, res) => {
  res.send('Movie has been removed from favorites');
});

//Allow existing users to deregister (showing only a text that a user email has been removed)
app.delete('/users/:username', (req, res) => {
  res.send('Your account was successfully deleted');
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
