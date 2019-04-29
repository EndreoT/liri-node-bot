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

### Results
Users enter a command and additional arguments via the command line. API calls using the Ajax and Spotify npm modules retrieve information and display it to the console. If the command and additional arguments are valid (eg. the given movie name exists), they are saved to a text file as logging information.

### Commands
LIRI Bot can be run using one of four commands:
1. Displays upcoming concerts for the given artist:
```
node liri.js concert-this <artist/band name here>
```
2. Displays infomation about songs matching the provided song name. Includes a Spotify link to the song preview:
```
node liri.js spotify-this-song <song name here>
```
3. Displays information about a given movie such as title, Rotten Tomatoes rating, and actors:
```
node liri.js movie-this <movie name here>
```
4. Retrieves a random command and additional arguments pair from the included text file, parses them, and pases them to LIRI Bot:
```
node liri.js do-what-it-says
```

### Examples
#### concert-this command
![concert-this command](./assets/gifs/concert-this.gif)
