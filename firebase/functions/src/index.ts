import * as functions from 'firebase-functions';
import * as express from 'express';
import * as googleMaps from '@google/maps';
import * as https from 'https';
import * as cors from 'cors';

const app: express.Application = express();
app.use(cors());

app.get('/places', (request: any, response: any) => {
    const query = {
        location: request.query.location,
        radius: request.query.radius,
        type: request.query.type,
        keyword: request.query.keyword,
    }

    https.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${query.location}&radius=${query.radius}&type=${query.type}&keyword=${query.keyword}&key=AIzaSyD58SIp-bmdg2tys7ilDI6e0uZIzmkTRoM`, (res) => {
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

    https.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${query.location}&key=AIzaSyD58SIp-bmdg2tys7ilDI6e0uZIzmkTRoM`, (res) => {
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
