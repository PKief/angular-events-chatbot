import * as express from 'express';
import * as path from 'path';
import * as googleMaps from '@google/maps';
import * as https from 'https';
import * as cors from 'cors';

const app: express.Application = express();
app.use(cors());

const PORT = process.env.PORT || 9001;
app.listen(PORT, () => {
    console.log('\x1b[33m%s\x1b[0m', `Production Express server running at http://localhost:${PORT}/`);
});

app.route('/places')
    .get((req: any, result: any) => {
        const params = {
            location: req.params.location,
            radius: req.params.radius,
            type: req.params.type,
            keyword: req.params.keyword,
        }

        https.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${params.location}&radius=${params.radius}&type=${params.type}&keyword=${params.keyword}&key=AIzaSyD58SIp-bmdg2tys7ilDI6e0uZIzmkTRoM`, (res) => {
            res.setEncoding("utf8");
            let body = "";
            res.on("data", data => {
                body += data;
            });
            res.on("end", () => {
                body = JSON.parse(body);
                result.send(body);
            });
        }).on('error', (e) => {
            console.error(e);
        });
    });