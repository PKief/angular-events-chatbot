"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const express = require("express");
const https = require("https");
const cors = require("cors");
require('dotenv').config();
const app = express();
app.use(cors());
const googleApiKey = process.env.GOOGLE_KEY;
app.get('/places', (request, response) => {
    const query = {
        location: request.query.location,
        radius: request.query.radius,
        type: request.query.type,
        keyword: request.query.keyword,
    };
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
app.get('/places/details', (request, response) => {
    const query = {
        placeid: request.query.placeid
    };
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
app.get('/geocode', (request, response) => {
    const query = {
        location: request.query.location
    };
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
exports.api = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map