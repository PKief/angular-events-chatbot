import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocationConfig } from '../models';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

declare var google: any;

@Injectable()
export class PlacesService {
  private baseURL = 'https://us-central1-events-chatbot.cloudfunctions.net/api';
  private client: any;

  constructor(private readonly http: HttpClient) { }

  /** 
   * Get the current location of the user.
  */
  getGeoLocation(): Promise<Coordinates> {
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

  /**
   * Get a list of locations.
   * @param config Configuration for the request
   */
  getLocations(config: LocationConfig) {
    // tslint:disable-next-line:max-line-length
    return this.http.get(`${this.baseURL}/places?location=${config.location}&radius=${config.radius || 5000}&type=${config.type}&keyword=${config.keyword || ''}`)
      .pipe(
        catchError(this.handleError('getLocations', []))
      );
  }

  /**
   * Get details about a location.
   * @param placeId Id of the place
   */
  getLocationDetail(placeId: string) {
    return this.http.get(`${this.baseURL}/places/details?placeid=${placeId}`)
      .pipe(
        catchError(this.handleError('getLocationDetails', []))
      );
  }

  /**
   * Get the longitude and latitude of a location.
   * @param location Name of the location (e.g. Karlsruhe)
   */
  getCoordinates(location: string) {
    return this.http.get(`${this.baseURL}/geocode?location=${location}`)
      .pipe(
        catchError(this.handleError('getCoordinates', []))
      );
  }

  private get headers() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      // console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
