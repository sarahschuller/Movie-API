const express = require('express'); //load express module
const app = express();

//initialize and use morgan app
const morgan = require('morgan');
app.use(morgan('common'));

//top 10 movies array
let movies=[
  {
    title: 'Suspiria',
    year: '1977',
    rating: 'R',
  },
  {
    title: 'A Nightmare on Elm Street',
    year: 1984,
    rating: 'R'
  },
  {
    title: 'Get Out',
    year: 2017,
    rating: 'R',
  },
  {
    title: 'Hereditary',
    year: 2018,
    rating: 'R',
  },
  {
    title: 'It',
    year: 2017,
    rating: 'R',
  },
  {
    title: 'Midsommar',
    year: 2019,
    rating: 'R',
  },
  {
    title: 'Carrie',
    year: 1976,
    rating: 'R',
  },
  {
    title:'The Witches',
    year: 1990,
    rating: 'PG',
  },
  {
    title:'Halloween',
    year: 1978,
    rating: 'R',
  },
  {
    title:'Little Shop of Horrors',
    year: 1986,
    rating: 'PG-13',
  },
];

//GET requests
app.get('/movies', (req, res) =>{
  res.json(movies);
});

app.get('/', (req, res) =>{
  res.send('Welcome to my Horror Movie App!');
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
