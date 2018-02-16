import * as functions from 'firebase-functions';
import * as express from 'express';
import * as googleMaps from '@google/maps';
import * as https from 'https';
import * as cors from 'cors';
const Stream = require('stream').Transform;

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

app.get('/places/photo', (request: any, response: any) => {
    const query = {
        photoReference: request.query.photo_reference,
        maxHeight: request.query.max_height,
        maxWidth: request.query.max_width,
    }

    https.get(`https://maps.googleapis.com/maps/api/place/photo?photoreference=${query.photoReference}&sensor=false&maxheight=${query.maxHeight}&maxwidth=${query.maxWidth}&key=AIzaSyD58SIp-bmdg2tys7ilDI6e0uZIzmkTRoM`, (res) => {
        // const data = new Stream();

        // res.on('data', function (chunk) {
        //     data.push(chunk);
        // });

        // res.on('end', function () {
        //     response.send(data.read());
        // });

        res.setEncoding('base64');
        let body = "data:" + res.headers["content-type"] + ";base64,";
        res.on('data', (data) => { body += data });
        res.on('end', () => {
            console.log(body);
            //return res.json({result: body, status: 'success'});
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

    https.get(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${query.placeid}&key=AIzaSyD58SIp-bmdg2tys7ilDI6e0uZIzmkTRoM`, (res) => {
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
