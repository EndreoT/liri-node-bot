require("dotenv").config();
const keys = require("./keys.js");

const Spotify = require('node-spotify-api');
const axios = require('axios');
const moment = require('moment');

const spotify = new Spotify(keys.spotify);

const bandsInTownAPIURLFirst = "https://rest.bandsintown.com/artists/";
const bandsInTownAPIURLSecond = "/events?app_id=codingbootcamp";


function makeBandsInTownURL(artist) {
    return bandsInTownAPIURLFirst + artist + bandsInTownAPIURLSecond;
}

function getAPIResource(APIURL) {
    axios.get(APIURL).then(response => {
        console.log('Venue locations:');
        console.log()
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
    }).catch(err => {
        console.log(err);
    })
}

function spotifyRequest(songTitle) {
    spotify
        .search({ type: 'track', query: songTitle, limit: 20 })
        .then(function (response) {
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
            getAPIResource(makeBandsInTownURL(artist))
            break;
        case 'spotify-this-song':
            let songTitle = process.argv.slice(3);
            if (songTitle.length === 0) {
                songTitle =  "The Sign"
            }
            spotifyRequest(songTitle)
                break;
        case 'help':
            console.log('help')
            break;
        default:
            console.log('Unrecognized command.')

    }
}
handleCommand();

