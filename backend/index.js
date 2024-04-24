import express, { request, response } from "express";
import { PORT, mondoDBURL } from "./config.js";
import mongoose from "mongoose";
import { Song } from './models/songModel.js'

const app = express();

//for parsing JSON
app.use(express.json());

app.get('/', (request, response) => {
    console.log(request)
    return response.status(234).send('Welcome to Piano Practice Tracker')
});

// saving a new practice song
app.post('/songs', async (request, response) => {
    try {
        console.log("line 19");
        if (
            !request.body.title ||
            !request.body.composer
        ){
            return response.status(400).send({
                message: 'Send all required fields: title, composer'
            })
        }
        const newSong = {
            title: request.body.title,
            composer: request.body.composer,
            year: request.body.year,
        }
        const song = await Song.create(newSong)
        return response.status(201).send(song)

    } catch (err) {
        cconsole.log(err.message);
        response.status(500).send({ message: err.message });
    }
});

// Get all songs from the database
app.get('/songs', async (request, response) => {
    try {
        const songs = await Song.find({});
        return response.status(200).json({
            count: songs.length,
            data: songs 
        });
    } catch (err) {
        console.log(err.message);
        response.status(500).send({ message: err.message})
    }
});

// Get all songs from the database by id
app.get('/songs/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const song = await Song.findById(id);
        return response.status(200).json(song);
    } catch (err) {
        console.log(err.message);
        response.status(500).send({ message: err.message});
    }
});

// Update a song
app.put('/songs/:id', async (request, response) => {
    try {
        
        if (
            !request.body.title ||
            !request.body.composer
        ){
            return response.status(400).send({
                message: 'Send all required fields: title, composer'
            })
        }
        const { id } = request.params;
        const song = await Song.findByIdAndUpdate(id, request.body);
        if (!song) {
            return response.status(404).json({ message: `Song ${id} not found`});
        }
        return response.status(200).send({ message: `Song ${id} updated!`});
    } catch(err) {
        console.log("line 87");
        console.log(err.message);
        response.status(500).send({ message: err.message});
    }
});


mongoose
    .connect(mondoDBURL)
    .then(() => {
        console.log('connected to DB');
        app.listen(PORT, () => {
            console.log(`App is listening to port: ${PORT}`);
        });
    })
    .catch((err) => {
        console.log(err)
    })