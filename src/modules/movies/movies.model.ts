import { Schema, model } from "mongoose";
import { IMovie } from "./movies.interfaces";

const entity = new Schema<IMovie>({
    title: {
        type: String,
        default: ''
    },
    magnet: {
        type: String,
        default: ''
    },
    fileName: {
        type: String,
        default: ''
    },
    sourceUrl: {
        type: String,
        default: ''
    },
    plot: {
        type: String,
        default: ''
    },
    year: {
        type: String,
        default: ''
    },
    director: {
        type: String,
        default: ''
    },
    actors: [
        {
            type: String,
            default: ''
        }
    ],
    backDrop: {
        type: String,
        default: ''
    },
    poster: {
        type: String,
        default: ''
    },
    trailer: {
        type: String,
        default: ''
    },
    boxOffice: {
        type: String,
        default: ''
    },
    released: {
        type: String,
        default: ''
    },
    writer: {
        type: String,
        default: ''
    },
    runtime: {
        type: String,
        default: ''
    },
    ratingImdb: {
        type: String,
        default: ''
    },
    imdbId: {
        type: String,
        default: ''
    },
    rated: {
        type: String,
        default: ''
    },
    genres: [
        {
            type: String,
            default: ''
        }
    ]
})

entity.index({
    title: 'text',
    writer: 'text'
})

export default model('movie', entity)