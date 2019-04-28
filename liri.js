"use strict"

// Config
require("dotenv").config();
const keys = require("./keys.js");
const textFilePath = 'random.txt';

const fs = require('fs');

// Third party packages
const Spotify = require('node-spotify-api');
const axios = require('axios');
const moment = require('moment');

const spotify = new Spotify(keys.spotify);

// bands in town
const bandsInTownAPIURLFirst = "https://rest.bandsintown.com/artists/";
const bandsInTownAPIURLSecond = "/events?app_id=codingbootcamp";

// OMDB
const OMDBApiURL = 'http://www.omdbapi.com/?apikey=trilogy&type=movie&plot=short&t=';

function makeBandsInTownURL(artist) {
    return bandsInTownAPIURLFirst + artist + bandsInTownAPIURLSecond;
}

// Makes an Axios GET requst to a given url. If successful, calls the callback with the response as argument
function getAPIResource(APIURL, callback, args, loggData) {
    axios.get(APIURL).then(response => {
        callback(response, args, loggData);
    }).catch(err => {
        console.log(err);
    })
}

// Writes logged command and ars to text file 
function loggData(args, command) {
    const loggedText = ';' + command + ',' + `"${args}"`
    fs.appendFile(textFilePath, loggedText, function (err) {
        if (err) {
            return console.log(err);
        }
    })
}

function bandsInTownResponse(response, args, loggData) {
    console.log('Venue locations for ' + args + ':' + '\n');

    // If band exists
    if (!(typeof response.data.venue === 'string')) {
        response.data.forEach(item => {
            const venue = item.venue;
            const venueName = venue.name;
            const venueLocation = venue.city + ' ' + venue.country;
            const eventDate = item.datetime;
            const eventDateFormatted = moment(eventDate).format('MM/DD/YYYY');

            console.log(venueName);
            console.log(venueLocation);
            console.log(eventDateFormatted);
            console.log();
        });

        if (loggData) {
            loggData(args, 'concert-this')
        }
        

    } else {
        console.log('The band ' + args + ' does not exist.')
    }

}

function OMDBResponse(response, args, loggData) {

    const data = response.data;
    const title = data.Title;
    const year = data.Year;

    // If movie exists
    if (data.Response === 'True') {
        const rottenTomatoRating = data.Ratings.filter(item => {
            return item.Source === 'Rotten Tomatoes';
        })[0].Value;
        const country = data.Country;
        const language = data.Language;
        const plot = data.Plot;
        const actors = data.Actors

        console.log('Movie information \n');
        console.log('Title: ' + title);
        console.log('Year: ' + year);
        console.log('Rotten Tomatoes rating: ' + rottenTomatoRating);
        console.log('Country produced: ' + country);
        console.log('Movie language: ' + language);
        console.log('Plot: ' + plot);
        console.log('Actors: ' + actors);

        if (loggData) {
            loggData(args, 'movie-this')
        }
        
    } else {
        console.log('The movie ' + args + ' does not exist.')
    }

}

function spotifyRequest(songTitle, loggData) {
    const songLimit = 20;
    spotify
        .search({ type: 'track', query: songTitle, limit: songLimit })
        .then(function (response) {

            const tracks = response.tracks.items;
            if (tracks.length > 0) {
                console.log(`Showing ${songLimit} results for the song '${songTitle}':\n`)

                response.tracks.items.forEach(item => {
                    const artist = item.artists[0].name;
                    const songName = item.name;
                    const previewLink = item.preview_url;
                    const songAlbum = item.album.name;
    
                    console.log('Artist: ' + artist);
                    console.log('Song: ' + songName);
                    console.log("Preview Link: " + previewLink);
                    console.log('Album: ' + songAlbum);
                    console.log()
                })
    
                if (loggData) {
                    loggData(songTitle, 'spotify-this-song')

                }
                
            } else {
                console.log('The song ' + songTitle + ' does not exist.')
            }
            

        })
        .catch(function (err) {
            console.log(err);
        });
}



function handleCommand(command, args) {

    if (!command) {
        return console.log("Please enter a command and try again.");
    }
    switch (command) {
        case 'concert-this':
            if (args.length === 0) {
                return console.log('No artist given');
            }
            getAPIResource(makeBandsInTownURL(args), bandsInTownResponse, args);
            break;
        case 'spotify-this-song':
            if (args.length === 0) {
                args = "The Sign";
            }
            spotifyRequest(args);
            break;
        case 'movie-this':
            if (args.length === 0) {
                args = 'Mr. Nobody';
            }
            getAPIResource(OMDBApiURL + args, OMDBResponse, args);
            break;
        case 'do-what-it-says':

            // Read from file of previously used commands
            fs.readFile(textFilePath, 'utf8', function (err, response) {
                if (err) {
                    return console.log(err);
                }
                // Get a random command
                const commandPoolStr = response;
                const commandPoolArr = commandPoolStr.split(';');
                const randomIndex = Math.floor(Math.random() * commandPoolArr.length);
                const newArgs = commandPoolArr[randomIndex].split(',');
                handleCommand(newArgs[0], newArgs[1]);
            })
            break;
        case 'help':
            console.log('Available commands:\n');
            console.log('concert-this <artist/band name here>');
            console.log('spotify-this-song <song name here>');
            console.log('movie-this <movie name here>');
            console.log('do-what-it-says');
            break;
        default:
            console.log('Unrecognized command.');
    }
}

function getArgs() {
    return process.argv.slice(3).join(' ');
}

function main() {
    const command = process.argv[2];
    handleCommand(command, getArgs());
}
// Add artist name to concert-this

main();