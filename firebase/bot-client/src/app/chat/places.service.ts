import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as googleMaps from '@google/maps';

declare var google: any;

@Injectable()
export class PlacesService {
  private baseURL = 'https://us-central1-events-chatbot.cloudfunctions.net/api';
  private client: any;

  constructor(private readonly http: HttpClient) {
    this.client = googleMaps.createClient({
      key: environment.google.eventsBot,
      Promise: Promise
    });
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

  getLocations(config: LocationConfig) {
    // tslint:disable-next-line:max-line-length
    return this.http.get(`${this.baseURL}/places?location=${config.location}&radius=${config.radius || 5000}&type=${config.type}&keyword=${config.keyword || ''}`);
  }

  getCoordinates(location: string) {
    return this.http.get(`${this.baseURL}/geocode?location=${location}`);
  }

  private get headers() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }
}

interface LocationConfig {
  type: string;
  location: string;
  keyword?: string;
  radius?: number;
}
