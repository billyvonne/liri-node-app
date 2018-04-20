//Liri takes the following arguments
// * my-tweets
// * spotify-this-song
// * movie-this
// * do-what-it-says
require("dotenv").config();

var keys = require("./keys.js");
var fs = require("fs");
var twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require("request");

//sets parameters so that it doesn't just pop out all information
var getTweets = function () {
    var client = new twitter(keys.twitter);
     
    var params = {screen_name: 'billy_vonne'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
      if (!error) {
        for(var i=0; i<tweets.length; i++) {
            console.log(tweets[i].created_at);
            console.log(' ');
            console.log(tweets[i].text);
        }
      }
    });
};

var artistName = function(artist) {
    return artist.name;
};


var getSong = function(songName) {

    var spotify = new Spotify(keys.spotify);
       
      spotify.search({ type: 'track', query: songName}, function(err, data) {

        if (err) {
          console.log('Error occurred: ' + err);
          return;
        }
       
      var songs = data.tracks.items;
      for(var i=0; i<songs.length; i++) {
          console.log(i);
          console.log('artist(s): ' + songs[i].artists.map(artistName));
          console.log('song name: ' + songs[i].name);
          console.log('preview song: ' + songs[i].preview_url);
          console.log('album: ' + songs[i].album.name);
          console.log('-----------------------------------------')
      }    
    });
}

var getMovie = function(movieName){
    request("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var jsonData = JSON.parse(body);

        console.log('Title: ' + jsonData.Title);
        console.log('Year: ' + jsonData.Year);
        console.log('Rated: ' + jsonData.Rated);
        console.log('IMDB Rating: ' + jsonData.imdbRating);
        console.log('Country: ' + jsonData.Country);
        console.log('Language: ' + jsonData.Language);
        console.log('Plot: ' + jsonData.Plot);
        console.log('Actors: ' + jsonData.Actors);
        console.log('Rotten Tomatoes Rating: ' + jsonData.tomatoRating);
      } 
    })
}

var doIt = function() {
    fs.readFile('random.txt', 'utf8', function (err, data) {
        if (err) throw err;

        var dataArr = data.split(',');
        
        if (dataArr.length == 2) {
            pick(dataArr[0], dataArr[1]);
        } else if (dataArr.length == 1) {
            pick(dataArr[0])
        }
    })
}

//This is where we use user inputs to pull from whatever API instead of the js just running everything at once
var pick = function(caseData, functionData) {
    switch(caseData) {
        case 'my-tweets' :
            getTweets();
            break;
        case 'spotify-this-song' :
            getSong(functionData);
            break;
        case 'movie-this' :
            getMovie(functionData);
            break;
        case 'do-what-it-says' :
            doIt();
            break;
    default:
    console.log('LIRI does not know that');
    }
}

var runThis = function(argOne, argTwo) {
    pick(argOne, argTwo);
}

//process.argv is going to be the arguments the user provides
//argv2 is going to be the tweet this or spotify this
//arg3 is going to be the movie or song or whatever
runThis(process.argv[2], process.argv[3]);
