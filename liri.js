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
function getAPIResource(APIURL, callback, args, logData) {
    console.log('url', APIURL)
    axios.get(APIURL).then(response => {
        callback(response, args, logData);
    }).catch(err => {
        console.log(err);
    })
}

// Writes logged command and args to text file 
function logDataToFile(args, command) {

    fs.readFile(textFilePath, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        let loggedText = '';
        if (data) {
            // only preped addition with semicolon if data already exists in file
            loggedText = ';'
        }
        loggedText += command + ',' + `"${args}"`
        fs.appendFile(textFilePath, loggedText, function (err) {
            if (err) {
                return console.log(err);
            }
        })

    })

}

// handle bands in town api reponse
function bandsInTownResponse(response, args, logData) {
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

        if (logData) {
            logDataToFile(args, 'concert-this')
        }

    } else {
        console.log('The band ' + args + ' does not exist.')
    }

}

// Handle OMBD api response
function OMDBResponse(response, args, logData) {

    const data = response.data;
    const title = data.Title;
    const year = data.Year;

    // Check if movie exists
    if (data.Response === 'True') {
        const rottenTomatoRating = data.Ratings.filter(item => {
            return item.Source === 'Rotten Tomatoes';
        })[0].Value;
        const country = data.Country;
        const language = data.Language;
        const plot = data.Plot;
        const actors = data.Actors

        console.log('Movie information for ' + args + '\n');
        console.log('Title: ' + title);
        console.log('Year: ' + year);
        console.log('Rotten Tomatoes rating: ' + rottenTomatoRating);
        console.log('Country produced: ' + country);
        console.log('Movie language: ' + language);
        console.log('Plot: ' + plot);
        console.log('Actors: ' + actors);

        if (logData) {
            logDataToFile(args, 'movie-this')
        }

    } else {
        console.log('The movie ' + args + ' does not exist.')
    }

}

// Handle spotify api reponse
function spotifyRequest(songTitle, logData) {
    const songLimit = 10;
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

                if (logData) {
                    logDataToFile(songTitle, 'spotify-this-song')
                }

            } else {
                console.log('The song ' + songTitle + ' does not exist.')
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}

// Determines handling of command and attitional string arguments arg from user input. 
// If logData === true, then log both command and arg data to text file
function handleCommand(command, args, logData) {

    if (!command) {
        return console.log("Please enter a command and try again.");
    }
    switch (command) {
        case 'concert-this':
            if (args.length === 0) {
                return console.log('No artist given');
            }
            getAPIResource(makeBandsInTownURL(args), bandsInTownResponse, args, logData);
            break;
        case 'spotify-this-song':
            if (args.length === 0) {
                args = "The Sign";
            }
            spotifyRequest(args, logData);
            break;
        case 'movie-this':
            if (args.length === 0) {
                args = 'Mr. Nobody';
            }
            getAPIResource(OMDBApiURL + args, OMDBResponse, args, logData);
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
                const newCommandAndArgs = commandPoolArr[randomIndex].split(',');

                const newCommand = newCommandAndArgs[0]
                let newArgs = newCommandAndArgs[1]

                // Remove double quotes ("") from string args
                newArgs = newArgs.slice(1, newArgs.length - 1)

                // Handle new command and args. Do not log to text file
                handleCommand(newCommand, newArgs, false);
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

// Extracts command line arguments
function getArgs() {
    return process.argv.slice(3).join(' ');
}

function main() {
    const command = process.argv[2];
    handleCommand(command, getArgs(), true);
}

main();