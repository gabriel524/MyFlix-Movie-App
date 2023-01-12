const express = require("express"),
  bodyParser = require("body-parser"),
  morgan = require("morgan"),
  fs = require("fs"),
  path = require("path");
uuid = require("uuid");
require("lodash");

const { check, validationResult } = require("express-validator");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require("cors");
app.use(cors());

let auth = require("./auth")(app);
const passport = require("passport");
require("./passport");

app.use(morgan("common")); //this adds morgan middlewar library

const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;

/*mongoose.connect("mongodb://localhost:27017/test",
  { useNewUrlParser: true,
    useUnifiedTopology: true });*/

mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//setting up logging stream
const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});

//middleware - logging, static public folder, error logging
app.use(morgan("combined", { stream: accessLogStream }));
app.use(express.static("public"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("somethng seems broken here!");
});

const cors = require("cors");
app.use(cors());

let allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:1234",
  "http://localhost:4200",
  "https://myflix-clint-bygabriel.netlify.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        //If a specific origin isn't found on the list of allowed origins
        let message =
          "The CORS policy for this application doesn't allow acces from origin" +
          origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);

//Begging of read
app.get("/", (req, res) => {
  res.send("Welcome to my movies app!");
});

app.get("/documentation", (req, res) => {
  res.sendFile(__dirname + "/public/documentation.html");
});

// Get all movies
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Get all users
app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Get a user by username
app.get(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Get json movie when looking for specific title of a movie
app.get(
  "/movies/:Title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ Title: req.params.Title })
      .then((movie) => {
        res.json(movie);
      })

      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Get json genre infomation when looking for specific movie genre
app.get(
  "/genre/:Name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "Genre.Name": req.params.Name })
      .then((genre) => {
        res.json(genre.Genre);
      })

      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Get infomation on director when looking for a specific director in the movies arry
app.get(
  "/director/:Name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "Director.Name": req.params.Name })
      .then((director) => {
        res.json(director.Director);
      })

      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
); //End of read

//Begging of Create
app.post(
  "/users",

  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  //passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
      .then((user) => {
        if (user) {
          //If the user is found, send a response that it already exists
          return res.status(400).send(req.body.Username + " already exists");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

// Add a movie to a user's list of favorites
app.post(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $push: { FavoriteMovies: req.params.MovieID },
      },
      { new: true }, //Returning any document that has been updated
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error:" + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
); //End of create

//Start of update
app.put(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true }, //Returning the unpdarted document
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error:" + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

//allow user to delete movie from favorites list
app.delete(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $pull: { FavoriteMovies: req.params.MovieID } },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

// allow user to be deleted
app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + " was not found!");
        } else {
          res.status(200).send(req.params.Username + " was deleted!");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
