import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as googleMaps from '@google/maps';

declare var google: any;

@Injectable()
export class PlacesService {
  private baseURL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
  private client: any;

  constructor(private readonly http: HttpClient) {
    this.client = googleMaps.createClient({
      key: environment.google.eventsBot,
      Promise: Promise
    });

    // this.getLocations('test').subscribe(result => {
    //   console.log(result);
    // });
  }

  private getGeoLocation(): Promise<Coordinates> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          resolve(position.coords);
        });
      } else {
        reject('Geolocation is not supported by this browser.');
      }
    });
  }

  getLocations(keyword: string) {
    const data = {
      // location: `${coord.latitude},${coord.longitude}`,
      location: '-33.8670522,151.1957362',
      radius: 500,
      type: 'restaurant',
      key: environment.google.eventsBot,
      keyword: keyword,
    };
    // return Promise.resolve();
    // tslint:disable-next-line:max-line-length
    return this.http.get(`https://us-central1-events-chatbot.cloudfunctions.net/api/places?location=-33.8670522,151.1957362&radius=5000&type=restaurant&keyword=cruise`);
    // this.client.placesNearby({
    //   language: 'en',
    //   location: [-33.865, 151.038],
    //   rankby: 'distance',
    //   minprice: 1,
    //   maxprice: 4,
    //   opennow: true,
    //   type: 'restaurant'
    // })
    //   .asPromise()
    //   .then(function (response) {
    //     console.log(response);
    //   });
  }

  private get headers() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

}
