const mongoose = require('mongoose');

let movieSchema = mongoose.Schema( {
    Title: {type: String, required: ture},
    Description: {type: String, required: ture},
    Genre: {
        Name: Sting,
        Description: String
    },
    Director: { String,
    Bio: Sting
    },
    Actors: [String],
    ImagePath: String,
    Featured: Boolean
});

let userSchema = mongoose.Schema({
    userName: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, requitred: true},
    Birthday: Date,
    FavoriteMovies: [{ type: mongoose.Schema,Types.ObjectId, ref: 'Movie'}]
});

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;