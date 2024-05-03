const express = require('express');
const {default: mongoose} = require('mongoose');

const server = express();
const portNumber = 8080;

server.use(express.static('public'));
server.use(express.urlencoded({extended: false}));

server.set("view engine", "ejs");
server.set("views", "views");

mongoose.connect('mongodb://127.0.0.1/FutureFunkDB').catch((err)=>{
    throw err;
});


const songSchema = new mongoose.Schema({
    name: {type:String, required: true},
    youtubeUrl: {type: String, default: ""},
    albumName: {type:String, default: ""}
}, {timestamps: true});

//Artist schema
const artistSchema = new mongoose.Schema({
    name: {type: String, required: true},
    bio: {type: String, default: "No Bio"},
    imageURL:{type:String, default: ""},
    songs: [songSchema]
}, {timestamps: true});

const Artist = mongoose.model("Artist", artistSchema);

//Listening to port
server.listen(portNumber, ()=>{
    console.log("Server is running at port number: " + portNumber);
});

server.post("/browse", (req, res)=>{
    try 
    {
        //song name and artist name for database parsing
        let songName = req.body.songSearchText;
        let artistName = req.body.artistSearchText;

        let maxSearchResultsCounter = 10;

        fetch('http://localhost:8080/database/artists.json')
        .then(res => res.json())
        .then((data) => {
            const searchResults = [];

            if((songName == undefined || songName == "") && 
            (artistName == undefined || artistName == ""))
            {
                for (let i = 0; i < data.length; i++) {                    
                    for (let j = 0; j < data[i].songs.length; j++) {
                        if(maxSearchResultsCounter > 0)
                        {
                            searchResults.push({
                                artist: data[i],
                                song: data[i].songs[j]
                            });

                            maxSearchResultsCounter--;
                        }
                        else
                        {
                            break;
                        }
                    }

                    if(maxSearchResultsCounter <= 0)
                    {
                        break;
                    }
                }
            }
            else if(!(songName == "" || songName == undefined) && (artistName == "" || artistName == undefined))
            {
                for (let i = 0; i < data.length; i++) {                    
                    for (let j = 0; j < data[i].songs.length; j++) {

                        let searchedSongNameText = data[i].songs[j].name.toLowerCase();
                        let lowercaseSongText = songName.toLowerCase();

                        if(searchedSongNameText.includes(lowercaseSongText))
                        {
                            searchResults.push({
                                artist: data[i],
                                song: data[i].songs[j]
                            });
                            maxSearchResultsCounter--;
                        }

                        if(maxSearchResultsCounter <= 0)
                        {
                            break;
                        }
                    }

                    if(maxSearchResultsCounter <= 0)
                    {
                        break;
                    }
                }
            }
            else if((songName == "" || songName == undefined) && !(artistName == "" || artistName == undefined))
            {
                for (let i = 0; i < data.length; i++) {
                    let queryArtistName = data[i].name.toLowerCase();
                    let lowercaseArtistNameText = artistName.toLowerCase();
                    
                    if(queryArtistName.includes(lowercaseArtistNameText))
                    {
                        for (let j = 0; j < data[i].songs.length; j++) {    

                            searchResults.push({
                                artist: data[i],
                                song: data[i].songs[j]
                            });

                            maxSearchResultsCounter--;

                            if(maxSearchResultsCounter <= 0)
                            {
                                break;
                            }
                        }
                    }

                    if(maxSearchResultsCounter <= 0)
                    {
                        break;
                    }
                }
            }
            else if(!(songName == "" || songName == undefined) && !(artistName == "" || artistName == undefined))
            {
                for (let i = 0; i < data.length; i++) {
                    let queryArtistName = data[i].name.toLowerCase();
                    let lowercaseArtistNameText = artistName.toLowerCase();
                    
                    if(queryArtistName.includes(lowercaseArtistNameText))
                    {
                        for (let j = 0; j < data[i].songs.length; j++) {

                            let searchedSongNameText = data[i].songs[j].name.toLowerCase();
                            let lowercaseSongText = songName.toLowerCase();
    
                            if(searchedSongNameText.includes(lowercaseSongText))
                            {
                                searchResults.push({
                                    artist: data[i],
                                    song: data[i].songs[j]
                                });
                                maxSearchResultsCounter--;
                            }

                            if(maxSearchResultsCounter <= 0)
                            {
                                break;
                            }
                        }
                    }

                    if(maxSearchResultsCounter <= 0)
                    {
                        break;
                    }
                }
            }

            res.render("browse", {searchedSongName: songName, searchedArtistName: artistName, searchData: searchResults});

        }).catch((err) => {console.log(err);});
    }
    catch (err) {
        console.log(err);
    }
});

server.post("/songInfo", (req, res)=>{
    let songName = req.body.songClicked;
    let artistName = req.body.artistClicked;

    fetch('http://localhost:8080/database/artists.json')
        .then(res => res.json())
        .then((data) => {

            let artistDataFound;
            let songDataFound;
            
            for (let i = 0; i < data.length; i++) {           
                if(data[i].name == artistName)
                {
                    for (let j = 0; j < data[i].songs.length; j++) {
                        if(data[i].songs[j].name == songName)
                        {
                            artistDataFound = data[i];
                            songDataFound = data[i].songs[j];
                            break;
                        }
                    }
                }

                if(!(songDataFound == undefined))
                {
                    break;
                }
            }

            res.render("song-result", {songData: songDataFound, artistData: artistDataFound});
        }).catch((err) => {console.log(err);});
});

server.post("/artistInfo", (req, res)=>{
    let artistName = req.body.artistClicked;

    fetch('http://localhost:8080/database/artists.json')
        .then(res => res.json())
        .then((data) => {

            let artistDataFound;
            
            for (let i = 0; i < data.length; i++) {           
                if(data[i].name == artistName)
                {
                    artistDataFound = data[i];
                    break;
                }
            }

            res.render("artist-result", {artistData: artistDataFound});
        }).catch((err) => {console.log(err);});
});

server.post("/addSong", async(req, res)=>{
    let songName = req.body.submitSongName;
    let artistName = req.body.submitSongArtistName;
    let youtubeUrl = req.body.submitSongYoutubeURL;
    let album = req.body.submitAlbumName;
    
    let embedYoutubeUrl = "https://www.youtube.com/embed/" + youtubeUrl.substring(youtubeUrl.indexOf("?v=") + 3);

    try
    {
        let artistSearch = await Artist.findOne({name: artistName});
    
        if(artistSearch == null)
        {
            //Creating a new artist with song
            const newArtist = new Artist({
                name: artistName,
                songs:[{name:songName, youtubeUrl: embedYoutubeUrl, albumName: album}]
            });

            await newArtist.save();

            res.render("result-submission", {messageText: `Successfully added ${songName} to the database!`});
        }
        else
        {
            //Exists
            let songFound = false;

            for (let index = 0; index < artistSearch.songs.length; index++) {
                if(artistSearch.songs.at(index).name == songName)
                {
                    songFound = true;
                    await Artist.updateOne({name: artistName, 'songs.name': songName}, {$set:{'songs.$.youtubeUrl': embedYoutubeUrl, 'songs.$.albumName': album}});
                    break;
                }
            }
    
            if(songFound == false)
            {
                artistSearch.songs.push({name: songName, youtubeUrl: embedYoutubeUrl, albumName: album});
            }
    
            await artistSearch.save();

            res.render("result-submission", {messageText: `Successfully updated ${songName}!`});
        }
    } catch (error) {
        res.render("result-submission", {messageText: `Error occurred during submission of song: ${songName}!`});
        console.log(error);
    }
    
});

server.post("/addArtist", async(req, res)=>{
    let artistName = req.body.submitArtistName;
    let artistBio = req.body.submitArtistBio;
    let artistImageURL = req.body.submitArtistImage;

    try 
    {
        let artistSearch = await Artist.findOne({name: artistName});
    
        if(artistSearch == null)
        {
            //Creating a new artist with song
            const newArtist = new Artist({
                name: artistName,
                bio: artistBio,
                imageURL: artistImageURL
            });;
    
            await newArtist.save();

            res.render("result-submission", {messageText: `Successfully added ${artistName} to the database!`});
        }
        else
        {
            //Exists
            artistSearch.bio = artistBio;
            artistSearch.imageURL = artistImageURL;

            await artistSearch.save();

            res.render("result-submission", {messageText: `Successfully updated ${artistName} to the database!`});
        }

    } catch (error) {
        res.render("result-submission", {messageText: `Error occurred during submission of artist: ${artistName}!`});
        console.log(error);
    }
    
});

server.post("/removeSong", async(req, res)=>{
    let songName = JSON.parse(req.body.removeSongName);
    let artistName = JSON.parse(req.body.removeSongArtistName);

    try 
    {
        let artistSearch = await Artist.findOne({name: artistName});
    
        if(!(artistSearch == null))
        {
            artistSearch.songs.pull({name: songName});
    
            await artistSearch.save();

            res.render("result-submission", {messageText: `Successfully removed ${songName} from the database!`});
        }
        else
        {
            res.render("result-submission", {messageText: `Could not find ${songName} in the database!`});
        }

    } catch (error) {
        console.log(error);
        res.render("result-submission", {messageText: `Errored occurred during removal of song: ${songName}!`});
    }
});

server.post("/removeArtist", async(req, res)=>{
    const artistName = req.body.removeArtistName;

    try 
    {
        const artistSearch = await Artist.findOne({name: artistName});

        if(artistSearch == null)
        {
            res.render("result-submission", {messageText: `Could not find ${artistName} in the the database!`});
        }
        else
        {
            await Artist.deleteOne({_id: artistSearch._id});
            res.render("result-submission", {messageText: `Successfully removed ${artistName} from the database!`});
        }

    } catch (error) {
        console.log(error);
        res.render("result-submission", {messageText: `Error occurred during removal of artist: ${artistName}!`});
    }
    
});