# LIRI Bot

## Description
LIRI Bot is a node.js command line application that allows users to retrieve information about music artists concerts, songs, and movies.

## Motivation 
LIRI Bot is designed for the spartan people who prefer to consume their information in plain text from a terminal and only that. No extra content or style is needed to display the information. For the more technically inclined, this LIRI Bot script can be automatically run so that for example users are always up to date on upcoming concerts for their favorite artists 

### Installation
```
cd path/to/liri-node-bot/
npm install
touch .env
```
You will need a Spotify developer account. In the .env file, add the following Spotify information:
```
SPOTIFY_ID=<your-spotify-id>
SPOTIFY_SECRET=<your-spotify-secret>
```

### Result
LIRI Bot can be run using one of four commands:
```
node liri.js concert-this <artist/band name here>
```
Returns upcoming concerst for the given artist.
```
node liri.js spotify-this-song <song name here>
node liri.js movie-this <movie name here>
node liri.js do-what-it-says
```

### concert-this command
![concert-this command](./assets/gifs/concert-this.gif)
