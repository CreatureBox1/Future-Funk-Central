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
        //Get database JSON and iterate for results
        // const songResults = ;
        // const artistResults = ;
        // res.render("browse", {songs: songResults, artists:artistResults});
        res.render("browse");
    } 
    catch (err) {
        console.log(err);
    }
});

server.post("/addSong", async(req, res)=>{
    let songName = req.body.submitSongName;
    let artistName = req.body.submitSongArtistName;
    let youtubeUrl = req.body.submitSongYoutubeURL;

    try
    {
        let artistSearch = await Artist.findOne({name: artistName});
    
        if(artistSearch == null)
        {
            //Creating a new artist with song
            const newArtist = new Artist({
                name: artistName,
                songs:[{name:songName, youtubeUrl: youtubeUrl}]
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
                    await Artist.updateOne({name: artistName, 'songs.name': songName}, {$set:{'songs.$.youtubeUrl': youtubeUrl}});
                    break;
                }
            }
    
            if(songFound == false)
            {
                artistSearch.songs.push({name: songName, youtubeUrl: youtubeUrl});
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
    let songName = req.body.removeSongName;
    let artistName = req.body.removeSongArtistName;

    try 
    {
        let artistSearch = await Artist.findOne({name: artistName});
    
        if(!(artistSearch == null))
        {
            artistSearch.songs.pull({name: songName});
    
            await newArtist.save();

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
    const artistName = req.body.removeSongArtistName;

    try 
    {
        const artistDeletion = await Artist.deleteOne({artist: artistName});

        if(artistDeletion == null)
        {
            res.render("result-submission", {messageText: `Could not find ${artistName} in the the database!`});
        }
        else
        {
            res.render("result-submission", {messageText: `Successfully removed ${artistName} from the database!`});
        }

        
    } catch (error) {
        console.log(error);
        res.render("result-submission", {messageText: `Error occurred during removal of artist: ${artistName}!`});
    }
    
});