const express = require('express'),
bodyParser = require('body-parser'),
  morgan = require('morgan'),
  fs = require('fs'), 
  path = require('path');
const { merge } = require('lodash');
  uuid = require('uuid');

  const mongoose = require ('mongoose');
  const Models = require('./models.js');

  const Movies = Models.Movie;
  const Users = Models.User
  mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });

  const app = express();
app.use(bodyParser.json());

app.use(morgan('common')); //add morgan middlewar library

//setting up logging stream
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {
  flags: 'a',
});

let users = [{
	"_id" : ObjectId("6290ffffb5b2ef31f261fbef"),
	"Username" : "Abraham Cooper",
	"Password" : "kwt@rt2022!",
	"Email" : "Abraham.will@gmail.com",
	"Birthday" : "26/04/1999",
	"FavoriteMovies" : [
		"6290cad69cc37ae6f751ddc9",
		"6290cad69cc37ae6f751ddcb"
	]
},
{
	"_id" : ObjectId("6290ffffb5b2ef31f261fbf0"),
	"Username" : "Emma W. Wyatt",
	"Password" : "BwR$00V_!Afjq",
	"Email" : "Wemmattawy35@gmail.com",
	"Birthday" : "11/5/1996",
	"FavoriteMovies" : [
		"6290cad69cc37ae6f751ddce",
		"6290cad69cc37ae6f751ddd1"
	]
},
{
	"_id" : ObjectId("6290ffffb5b2ef31f261fbf2"),
	"Username" : "Jane E.Addison",
	"Password" : "E29.wkpjr_my!47Km",
	"Email" : "Ejan.alTw25@hotmail.com",
	"Birthday" : "15/12/1992",
	"FavoriteMovies" : [
		"6290cad69cc37ae6f751ddc8",
		"6290cad69cc37ae6f751ddcb",
		"6290cad69cc37ae6f751ddcf"
	]
}
{
	"_id" : ObjectId("6290ffffb5b2ef31f261fbf3"),
	"Username" : "Alexa Bright",
	"Password" : "Ale_tr00!wm09g",
	"Email" : "brightalexa.343t@gmail.com",
	"Birthday" : "10/8/1974",
	"FavoriteMovies" : [
		"6290cad69cc37ae6f751ddc9",
		"6290cad69cc37ae6f751ddd0",
		ObjectId("6290ffffb5b2ef31f261fbf3")
	]
},
{
	"_id" : ObjectId("6290ffffb5b2ef31f261fbf4"),
	"Username" : "Williams Smith",
	"Password" : "Wspgkf0562g336488_23",
	"Email" : "willsmith.8103@gmail.com",
	"Birthday" : "23/2/1997",
	"FavoriteMovies" : [
		"6290cad69cc37ae6f751ddcc",
		"6290cad69cc37ae6f751ddd1",
		"6290cad69cc37ae6f751ddca"
	]
}


//top 10 movies according to IMDB
let movies = [ {
  Title: "Star Wars:The Last Jedi",
  Description:"The Last Jedi follows Rey as she seeks the aid of Luke Skywalker, in hopes of turning the tide for the Resistance in the fight against Kylo Ren and the First Order.",
  Genre: {
    Name: "Science Fiction, Fantasy, Action.",
    Description: "Star Wars: The Last Jedi (also known as Star Wars: Episode VIII-The Last Jedi) is a 2017 American epic space opera.",
    Actors: ["Mark Hamill", "Daisy Ridley", "Adam Driver", "john Boyega"],
  },

  Director: {
    Name: "Rian Johnson.",
    Bio: "Rian Craig Johnson is an American filmmaker. He made his directorial debut with the neo-noir mystery film Brick, which received positive reviews and grossed nearly $4 million on a $450,000 budget.",
    Birthyear:" December 17, 1973",
    Deathyear:"....."

  },
  
  Imagepath: "https://www.imdb.com/title/tt2527336/mediaviewer/rm574104832/?ref_=tt_ov_i",
  Featured: true
},

{
  Title: "Smallville",
  Description:"Smallville is based on the popular DC Comics character, Superman. The series follows the life of a teenage Clark Kent living in the town of Smallville, Kansas that is set at the start of the 21st century.",
  Genre: {
    Name: "Supernatural, Action, Drama, Superhero.",
    Description: "Smallville ; Genre. Action-adventure · Drama · Superhero ; Based on. Superman.",
    Actors: ["Tom Welling", "Michael Rosenbanum", "Kristin Kreuk", "John Schneider", "Annette O'Toole"],
  },

  Director: {
    Name:"Greg Beeman",
    Bio:"Greg Beeman is an American film and television director and producer and winner of the Director's Guild of America award for Outstanding Directorial Achievement.",
    Birthyear:"1962",
    Deathyear:"....",
  },
  Imagepath: "https://www.imdb.com/title/tt0279600/mediaviewer/rm1689082368/",
  Featured:true
},

{
  Title: "The Adam Project",
  Description: "After accidentally crash-landing in 2022, time-traveling fighter pilot Adam Reed teams up with his 12-year-old self for a mission to save the future.",
  Genre: {
    Name: "Action, Drama, Comedy AveSci-fi/Adventure",
    Description: "Smallville ; Genre. Action-adventure · Drama.",
    Actors: ["Ryan Reynolds", "Walker Scobell", "Jennifer Garner", "Mark Ruffalo"],
},

Director: {
  Name:"Christopher Nolan",
  Bio:"Christopher Nolan CBE is a British-American film director, producer, and screenwriter.",
  Birthyear:"July 30, 1970",
  Deathyear:"....",
},

Imagepath: "https://best-of-netflix.com/the-adam-project-playlist-a-full-list-of-all-the-songs-in-the-netflix-film/",
Featured: true
},

{
  Title: "The Matrix",
  Description:"Thomas Anderson, a computer programmer, is led to fight an underground war against powerful computers who have constructed his entire reality with a system called the Matrix.",
  Genre: {
    Name:"Science fiction; Fantasy, Action",
    Description: "The Matrix is an action movie, pure and simple- more of a Post-Apocalyptic; Science fiction; Action.",
    Actors:["Keanu Reeves", "Carrie Anne", "Laurance Fishburne" , "Monica Bellucci"],
},

Director: {
  Name:"Lana Wachowski",
  Bio:"Lana Wachowski is an American film and television directors, writers and producers.",
  Birthyear:"June 21, 1965 ",
  Deathyear:"....",
},

Imagepath: "https://www.imdb.com/title/tt0133093/mediaviewer/rm525547776/",
Featured: true
},

{
  Title: "Spider-Man: No Way Home.",
  Description:"Spider-Man: No Way Home is a 2021 American superhero film based on the Marvel Comics character Spider-Man",
  Genre: {
    Name:"Action/Adventure",
    Description: "Spider-Man: No Way Home is a 2021 American superhero film based on the Marvel Comics character Spider-Man.",
    Actors:["Tom Holland", "Tobey Maguire", "Zendaya", "Andrew Garfield" ],
},

Director:{
  Name:"Jon Watts",
  Bio:"Jonathan Watts is an American filmmaker. His credits include directing the Marvel Cinematic Universe superhero films Spider-Man: Homecoming, Spider-Man: Far From Home, and Spider-Man: No Way Home.",
  Birthyear:"June 28, 1981",
  Deathyear:"....",
},

Imagepath:"https://www.imdb.com/title/tt10872600/mediaviewer/rm3936939521/?ref_=tt_ov_i",
Featured: true
},

{
  Title: "Game of Thrones",
  Description:"Nine noble families wage war against each other in order to gain control over the mythical land of Westeros. Meanwhile, a force is rising after millenniums and threatens the existence of living men.",
  Genre: {
    Name:"Faction Adventure Fantasy Serial drama Tragedy",
    Description: "Game of Thrones is a Action Adventure Fantasy Serial drama Tragedy.",
    Actors:["Emilia Clarke", "Kit Harington", "Sophie Turner", "Maisie Williams"],
},

Director:{
  Name:"Alan Taylor",
  Bio: "lan Taylor is an American television and film director. He is known for his work on TV shows such as Lost, The West Wing, Six Feet Under, Sex and the City, The Sopranos, Game of Thrones, Boardwalk Empire, Deadwood, and Mad Men.",
  Birthyear: "January 13, 1959",
  Deathyear:".....",
},

Imagepath:"https://www.imdb.com/title/tt0944947/mediaviewer/rm4204167425/",
Featured:true
},

{
  Title: "The Lord of the Rings: The Return of the King",
  Description:"The former Fellowship members prepare for the final battle. While Frodo and Sam approach Mount Doom to destroy the One Ring, they follow Gollum, unaware of the path he is leading them to.",
  Genre: {
    Name:"Fantasy",
    Description: "The Lord of the Rings: The Return of the King is a 2003 epic fantasy adventure film directed by Peter Jackson, based on the third volume of J. R. R. ..",
    Actors:["Elijah Wood", "Viggo Mortensen", "Ian McKellen"],
},

Director:{
  Name:"Sir Peter Jackson",
  Bio:"Sir Peter Robert Jackson ONZ KNZM is a New Zealand film director, screenwriter, and film producer.",
  Birthyear:"October 31, 1961",
  Deathyear:".....",
},

Imagepath: "https://www.imdb.com/title/tt0167260/mediaviewer/rm584928512/?ref_=tt_ov_i",
Featured: true
},

{
  Title: "Eternals",
  Description:"The Eternals are a race of near-immortal synthetic beings created by the Celestials.",
  Genre: {
    Name:"Fantasy",
    Description: "The saga of the Eternals is a Action Adventure Fantasy film.",
    Actors: ["Angelina Jolie", "Harry Styles", "Kit Harington", "Richard Madden", "Gemma Chan"],
},
Director: {
  Name: "Chloe Zhao",
  Bio: "Chloé Zhao, born Zhao Ting, is a Chinese filmmaker, known primarily for her work on independent films.",
  Birthyear:"March 31, 1982",
  Deathyear:".....",
},

Imagepath: "https://www.imdb.com/title/tt9032400/mediaviewer/rm1516895489/?ref_=tt_ov_i",
Featured: true
},

{
  Title: "Man of Steel",
  Description: "With the imminent destruction of Krypton, their home planet, Jor-El (Russell Crowe) and his wife seek to preserve their race by sending their infant son to Earth. The child's spacecraft lands at the farm of Jonathan (Kevin Costner) and Martha (Diane Lane) Kent, who name him Clark and raise him as their own son.",
  Genre: {
    Name:"Fantasy/Superhero",
    Description:"Man of Steel is a science fiction/fantasy adventure than a superhero movie.", 
    Actors: ["Henry Cavill", "Amy Adams", "Michael Shannon", "Kevin Costner", "Diane Lane"],
},

Director:{
    Name: "Zack Snyder",
    Bio: "Zachary Edward Snyder is an American film director, producer, screenwriter, and cinematographer.",
    Birthyear:"March 1, 1966",
    Deathyear:".....",
  },
  Imagepath: "https://www.imdb.com/title/tt0770828/mediaviewer/rm2035131904/?ref_=tt_ov_i",
  Featured: true
},

{
  Title: "The Lord of the Rings: The Fellowship of the Ring",
  Description:"Synopsis. Sauron, the Dark Lord, has awakened and threatens to conquer Middle-earth. To stop this ancient evil once and for all, Frodo Baggins must destroy the One Ring in the fires of Mount Doom.Men, Hobbits, a wizard, an Elf, and a Dwarf form a fellowship to help him on his quest.",
  Genre: {
    Name:'Fantasy',
    Description: "The Fellowship of the Ring is a 2001 epic fantasy adventure film.",
    Actors: ["Elijah Wood", "Orlando Bloom", "Ian McKellen."],
  },

  Director: {
    Name: "Sir Peter Jackson",
    Bio: "Sir Peter Robert Jackson ONZ KNZM is a New Zealand film director, screenwriter, and film producer.",
    Birthyear:"October 31, 1961",
    Deathyear:".....",

  },
  Imagepath: "https://www.imdb.com/title/tt0120737/mediaviewer/rm3592958976/?ref_=tt_ov_i",
  Featured: true
}];

//middleware - logging, static public folder, error logging
app.use(morgan('combined', { stream: accessLogStream }));
app.use(express.static('public'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('somethng seems broken here!');
});

//Create
app.post('/users', (req, res) => {
  const newUser = req.body;

  if(newUser.name) {
    newUser.id = uuid.v4()
    users.push(newUser);
    res.status(201).json(newUser)
  }
  else{
    res.status(400).send('users need names')
  }
});

//Update
app.put('/users/:id', (req, res) => {
  const{ id } = req.params;
  const updatedUser = req.body;

  let user = users.find( user => user.id == id);

  if(user){
    user.name = updatedUser.name
    res.status(200).json(user);
  }

  else{
    res.status(400).send("no such user")
  }

});

//Create
app.post('/users/:id/:movieTitle', (req, res) => {
  const{ id, movieTitle } = req.params;

  let user = users.find( user => user.id == id);

  if(user){
    user.favoriteMovies.push(movieTitle)
    res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
  } else {
    res.status(400).send("no such user")
  }

});

//Delete
app.delete('/users/:id/:movieTitle', (req, res) => {
  const{ id, movieTitle } = req.params;

  let user = users.find( user => user.id == id);

  if(user){
    user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
    res.status(200).send(`${movieTitle} has been remove from user ${id}'s array`);
  } else {
    res.status(400).send("no such user")
  }
});

  //Delete
app.delete('/users/:id', (req, res) => {
  const{ id } = req.params;

  let user = users.find( user => user.id == id);

  if(user){
    users.favoriteMovies = users.filter( user => user.id != id);
    res.status(200).send(`user ${id} has been deleted`);
  } else {
    res.status(400).send("no such user")
  }
});


//Read
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
});

//Read
app.get('/movies/:title', (req, res) => {
  const{ title } = req.params;
  const movie = movies.find(movie => movie.Title === title);

  if(movie){
    res.status(200).json(movie);
  }
  else{
    res.status(400).send('There is no such movie')
  }
});

//Read
app.get('/movies/genre/:genreName', (req, res) => {
  const {genreName} = req.params;
  const genre = movies.find(movie => movie.Genre.Name === genreName).Genre;

  if(genre){
    res.status(200).json(genre);
  }
  else{
    res.status(400).send('There is no such genre')
  }
});

//Read
app.get('/movies/directors/:directorName', (req, res) => {
  const {directorName} = req.params;
  const director = movies.find(movie => movie.Director.Name === directorName).Director;

  if(director){
    res.status(200).json(director);
  }
  else{
    res.status(400).send('There is no such director')
  }
});

app.get('/documentation', (req, res) => {
  res.sendFile(__dirname + '/public/documentation.html');
});

app.listen(8080, () => {
  console.log('listening on port 8080');
});


