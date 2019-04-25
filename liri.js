require("dotenv").config();
const keys = require("./keys.js");

const Spotify = require('node-spotify-api');
const axios = require('axios');
const moment = require('moment');

const spotify = new Spotify(keys.spotify);

const bandsInTownAPIURLFirst = "https://rest.bandsintown.com/artists/";
const bandsInTownAPIURLSecond = "/events?app_id=codingbootcamp";

const OMDBApiURL ='http://www.omdbapi.com/?apikey=trilogy&type=movie&plot=short&t='

function makeBandsInTownURL(artist) {
    return bandsInTownAPIURLFirst + artist + bandsInTownAPIURLSecond;
}

function getAPIResource(APIURL, callback) {
    axios.get(APIURL).then(response => {
        callback(response);
    }).catch(err => {
        console.log(err);
    })
}

function bandsInTownResponse(response) {
    console.log('Venue locations:\n');

        response.data.forEach(item => {
            const venue = item.venue
            const venueName = venue.name;
            const venueLocation = venue.city + ' ' + venue.country;
            const eventDate = item.datetime;
            const eventDateFormatted = moment(eventDate).format('MM/DD/YYYY')

            console.log(venueName)
            console.log(venueLocation)
            console.log(eventDateFormatted)
            console.log();
        });
}

function OMDBResponse(response) {
    
    const data = response.data;
    const title = data.Title;
    const year = data.Year;
    const rottenTomatoRating = data.Ratings.filter(item => {
        return item.Source === 'Rotten Tomatoes';
    })[0].Value;
    const country = data.Country;
    const language = data.Language;
    const plot = data.Plot;
    const actors= data.Actors

    console.log('Movie information \n');
    console.log('Title: ' + title)
    console.log('Year: ' + year)
    console.log('Rotten Tomato rating: ' + rottenTomatoRating)
    console.log('Country produced: ' +  country)
    console.log('Movie language: ' + language)
    console.log('Plot: ' + plot)
    console.log('Actors: ' + actors)
} 

function spotifyRequest(songTitle) {
    spotify
        .search({ type: 'track', query: songTitle, limit: 20 })
        .then(function (response) {
            console.log('Information for song:\n')

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
        })
        .catch(function (err) {
            console.log(err);
        });
}

function handleCommand() {
    const command = process.argv[2];
    if (!command) {
        return console.log("Please enter a command.")
    }
    switch (command) {
        case 'concert-this':
            const artist = process.argv.slice(3).join(' ');
            if (artist.length === 0) {
                console.log('no artist')
            }
            getAPIResource(makeBandsInTownURL(artist), bandsInTownResponse)
            break;
        case 'spotify-this-song':
            let songTitle = process.argv.slice(3).join( '');
            if (songTitle.length === 0) {
                songTitle = "The Sign"
            }
            spotifyRequest(songTitle)
            break;
        case 'movie-this':
            let movie = process.argv.slice(3).join(' ');
            if (movie.length === 0) {
                movie = 'Mr. Nobody';
            }
            getAPIResource(OMDBApiURL + movie, OMDBResponse)
            break;

        case 'help':
            console.log('Available commands:\n')
            console.log('concert-this <artist/band name here>')
            console.log('spotify-this-song <song name here>')
            console.log('movie-this <movie name here>')
            console.log('do-what-it-says')
            break;
        default:
            console.log('Unrecognized command.')

    }
}
handleCommand();

