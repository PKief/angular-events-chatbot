import * as functions from 'firebase-functions';
import * as express from 'express';
import * as https from 'https';
import * as cors from 'cors';
require('dotenv').config();

const app: express.Application = express();
app.use(cors());

const googleApiKey = process.env.GOOGLE_KEY;

app.get('/places', (request: any, response: any) => {
    const query = {
        location: request.query.location,
        radius: request.query.radius,
        type: request.query.type,
        keyword: request.query.keyword,
    }

    https.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${query.location}&radius=${query.radius}&type=${query.type}&keyword=${query.keyword}&key=${googleApiKey}`, (res) => {
        res.setEncoding("utf8");
        let body = "";
        res.on("data", data => {
            body += data;
        });
        res.on("end", () => {
            body = JSON.parse(body);
            response.send(body);
        });
    }).on('error', (e) => {
        console.error(e);
    });
});

app.get('/places/details', (request: any, response: any) => {
    const query = {
        placeid: request.query.placeid
    }

    https.get(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${query.placeid}&key=${googleApiKey}`, (res) => {
        res.setEncoding("utf8");
        let body = "";
        res.on("data", data => {
            body += data;
        });
        res.on("end", () => {
            body = JSON.parse(body);
            response.send(body);
        });
    }).on('error', (e) => {
        console.error(e);
    });
});

app.get('/geocode', (request: any, response: any) => {
    const query = {
        location: request.query.location
    }

    https.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${query.location}&key=${googleApiKey}`, (res) => {
        res.setEncoding("utf8");
        let body = "";
        res.on("data", data => {
            body += data;
        });
        res.on("end", () => {
            body = JSON.parse(body);
            response.send(body);
        });
    }).on('error', (e) => {
        console.error(e);
    });
});

export const api = functions.https.onRequest(app);
