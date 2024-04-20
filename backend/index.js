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
        cconsole.log(err.message)
        response.status(500).send({ message: err.message})
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