const express = require('express'),
bodyParser = require('body-parser'),
  morgan = require('morgan'),
  fs = require('fs'),
  path = require('path');

const app = express();

app.use(bodyParser.json());
 
app.use(morgan('common')); //add morgan middlewar library

//setting up logging stream
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {
  flags: 'a',
});

//top 10 movies according to IMDB
const topMovies = [
  {
    title: 'Star Wars:The Last Jedi ',
    director: 'Rian Johnson',
    stars: ['Mark Hamill', 'Daisy Ridley', 'Adam Driver', 'john Boyega'],
    genre: 'Science Fiction, Fantasy, Action',
  },

  {
    title: 'Smallville',
    director: 'Greg Beeman',
    stars: ['Tom Welling', 'Michael Rosenbanum', 'Kristin Kreuk', 'John Schneider', "Annette O'Toole"],
    genre: 'Supernatural, Action, Drama, Superhero',
  },
  {
    title: 'The Adam Project',
    director: 'Christopher Nolan',
    stars: ['Ryan Reynolds', 'Walker Scobell', 'Jennifer Garner', ' Mark Ruffalo'],
    genre: 'Adventure, Drama, Comedy',
  },
  {
    title: 'The Matrix',
    director: 'Lana Wachowski',
    stars: ['Keanu Reeves', 'Carrie Anne', 'Laurance Fishburne' , 'Monica Bellucci'],
    genre: 'Action, Fantasy',
  },
  {
    title: 'Spider-Man: No Way Home',
    director: 'Jon Watts',
    stars: ['Tom Holland', 'Tobey Maguire', 'Zendaya', 'Andrew Garfield' ],
    genre: 'Action/Adventure',
  },
  {
    title: "Game of Thrones",
    director: 'Alan Taylor',
    stars: ['Emilia Clarke', 'Kit Harington', 'Sophie Turner','Maisie Williams'],
    genre: 'Action, Adventure, Fantasy, Serial drama, Tragedy',
  },
  {
    title: 'The Lord of the Rings: The Return of the King',
    director: 'Peter Jackson',
    stars: ['Elijah Wood', 'Viggo Mortensen', 'Ian McKellen'],
    genre: 'Fantasy',
  },
  {
    title: 'Eternals',
    director: 'Chloe Zhao',
    stars: ['Angelina Jolie', 'Harry Styles', 'Kit Harington', 'Richard Madden', 'Gemma Chan'],
    genre: 'Science Fiction, Actionm Superhero',
  },
  {
    title: 'Man of Steel',
    director: 'Zack Snyder',
    stars: ['Henry Cavill', 'Amy Adams', 'Michael Shannon','Kevin Costner','Diane Lane'],
    genre: 'Fantasy/Superhero',

  },
  {
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    director: 'Peter Jackson',
    stars: ['Elijah Wood', 'Orlando Bloom', 'Ian McKellen'],
    genre: 'Fantasy',
  },
];

//middleware - logging, static public folder, error logging
app.use(morgan('combined', { stream: accessLogStream }));
app.use(express.static('public'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('somethng seems broken here!');
});
//logic here to send a response
app.get('/', (req, res) => {
  res.send('Welcome to MyFlix Movie App!');
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.get('/movies/:title', (req, res) => {
  res.json(
    topMovies.find((movie) => {
      return movie.title === req.params.title;
    })
  );
});

app.get('/movies/genre/:title', (req, res) => {
  let movie = topMovies.find((movie) => {
    return movie.title === req.params.title;
  });
  if (movie) {
    res.status(200).send(`${req.params.title} is a ${movie.genre}`);
  } else {
    res.status(400).send('Movie not Found');
  }
});

app.get('/directors/:name', (req, res) => {
  res.status(200).send(`Request recived for ${req.params.name}`);
});

app.get('/documentation', (req, res) => {
  res.sendFile(__dirname + '/public/documentation.html');
});

app.listen(8080, () => {
  console.log('listening on port 8080');
});
