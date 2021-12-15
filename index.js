const express = require('express'); //load express module
const app = express();

//top 10 movies array
let movies=[
  {
    title: 'Suspiria',
    year: '1977'
  },
  {
    title: 'A Nightmare on Elm Street',
    year: 1984
  },
  {
    title: 'Get Out',
    year: 2017
  },
  {
    title: 'Hereditary',
    year: 2018
  },
  {
    title: 'It',
    year: 2017
  },
  {
    title: 'Midsommar',
    year: 2019
  },
  {
    title: 'Carrie',
    year: 1976
  },
  {
    title:'Train to Busan (Busanhaeng)',
    year: 2016
  },
  {
    title:'Halloween',
    year: 1978
  },
  {
    title:'Misery',
    year: 1990
  },
];

//GET requests
app.get('/movies', (req, res) =>{
  res.json(movies);
});

app.get('/', (req, res) =>{
  res.send('Welcome to my Horror Movie App!');
});

//app listener
app.listen(8080, () => {
  console.log('This app is listening on port 8080.');
});
