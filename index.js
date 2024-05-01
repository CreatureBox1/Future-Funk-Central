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
    } 
    catch (err) {
        console.log(err);
    }
});

server.post("/addSong", async(req, res)=>{
    const songName = req.body.submitSongName;
    const artistName = req.body.submitSongArtistName;
    const youtubeURL = req.body.submitSongYoutubeURL;

    try 
    {
        const artistSearch = await Artist.findOne({artist: artistName}, function(err, result) {
            if (err) throw err;
        });
    
        if(artistSearch.length <= 0)
        {
            //Creating a new artist with song
            const newArtist = new Artist({
                name: artistName,
    
            });;
    
            await newArtist.save();
        }
        else
        {
            //Exists
            const songFound = false;
            for (let index = 0; index < artistSearch.songs.length; index++) {
                if(artistSearch.songs.at(index).name == songName)
                {
                    songFound = true;
                    artistSearch.songs.at(index).youtubeUrl = youtubeURL;
                    break;
                }
            }
    
            if(songFound == false)
            {
                artistSearch.songs.push({name: songName, youtubeUrl: youtubeURL});
            }
    
            await artistSearch.save();
        }

        res.render("result-submission", {messageText: `Successfully added ${songName} to the database!`});

    } catch (error) {
        console.log(error);
    }
    
});

server.post("/addArtist", async(req, res)=>{
    const artistName = req.body.submitArtistName;
    const artistBio = req.body.submitArtistBio;
    const artistImageURL = req.body.submitArtistImage;

    try 
    {
        const artistSearch = await Artist.findOne({artist: artistName}, function(err, result) {
            if (err) throw err;
        });
    
        if(artistSearch.length <= 0)
        {
            //Creating a new artist with song
            const newArtist = new Artist({
                name: artistName,
                bio: artistBio,
                imageURL: artistImageURL
            });;
    
            await newArtist.save();
        }
        else
        {
            //Exists
            artistSearch.bio = artistBio;
            artistSearch.imageURL = artistImageURL;
    
            await artistSearch.save();
        }
    
        res.render("result-submission", {messageText: `Successfully added ${artistName} to the database!`});

    } catch (error) {
        console.log(error);
    }
    
});

server.post("/removeSong", async(req, res)=>{
    const songName = req.body.removeSongName;
    const artistName = req.body.removeSongArtistName;

    try 
    {
        const artistSearch = await Artist.findOne({artist: artistName, 'artist.songs.name': songName}, function(err, result) {
            if (err) throw err;
        });
    
        if((artistSearch.length <= 0))
        {
            //Creating a new artist with song
            artistSearch.songs.remove({name: songName});
    
            await newArtist.save();
        }
    
        res.render("result-submission", {messageText: `Successfully removed ${songName} from the database!`});

    } catch (error) {
        console.log(error);
    }
});

server.post("/removeArtist", async(req, res)=>{
    const artistName = req.body.removeSongArtistName;

    try 
    {
        const artistSearch = await Artist.deleteOne({artist: artistName}, function(err, result) {
            if (err) throw err;
        });

        res.render("result-submission", {messageText: `Successfully removed ${artistName} from the database!`});
    } catch (error) {
        console.log(error);
    }
    
});