import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocationConfig } from '../models';

declare var google: any;

@Injectable()
export class PlacesService {
  private baseURL = 'https://us-central1-events-chatbot.cloudfunctions.net/api';
  private client: any;

  constructor(private readonly http: HttpClient) { }

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

  getLocations(config: LocationConfig) {
    // tslint:disable-next-line:max-line-length
    return this.http.get(`${this.baseURL}/places?location=${config.location}&radius=${config.radius || 5000}&type=${config.type}&keyword=${config.keyword || ''}`);
  }

  getLocationDetail(placeId: string) {
    return this.http.get(`${this.baseURL}/places/details?placeid=${placeId}`);
  }

  getCoordinates(location: string) {
    return this.http.get(`${this.baseURL}/geocode?location=${location}`);
  }

  getPhoto(photoreference: string, maxheight: number, maxWidth: number) {
    // tslint:disable-next-line:max-line-length
    return this.http.get(`${this.baseURL}/places/photo?photoreference=${photoreference}&sensor=false&maxheight=${maxheight}&maxwidth=${maxWidth}`);
  }

  private get headers() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }
}
