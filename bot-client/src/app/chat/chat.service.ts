import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { PlacesService } from './places.service';
import { Location } from '../models';
import { map } from 'rxjs/operators/map';

@Injectable()
export class ChatService {
  private readonly token = environment.dialogflow.eventsBot;
  private readonly baseURL = 'https://api.dialogflow.com/v1/query?v=20150910';

  chatMessages: BehaviorSubject<any[]>;
  locationsList: Location[];
  private listStartIndex = 0;
  private listAmount = 4;

  isLoading: BehaviorSubject<boolean>;

  constructor(
    private readonly http: HttpClient,
    private readonly places: PlacesService,
  ) {
    this.chatMessages = new BehaviorSubject([]);
    this.isLoading = new BehaviorSubject(true);
  }

  /**
   * Headers for http requests
   */
  private get headers() {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });
  }

  /**
   * Add a new message to the chat log
   * @param message Message text
   * @param isBot Is the message from the bot?
   */
  addMessageToChat(message: string, isBot: boolean, locationsList = []) {
    this.chatMessages.next([...this.chatMessages.value, {
      id: Math.random(),
      text: message,
      locationsList,
      bot: isBot,
      date: Date.now(),
    }]);
  }

  /**
   * Send a message to dialog flow
   * @param query Message that will be parsed by dialogflow
   */
  getResponse(query: string) {
    const data = {
      lang: 'de',
      query,
      sessionId: '12345',
      timezone: 'Europe/Madrid'
    };
    this.isLoading.next(true);
    return this.http.post(`${this.baseURL}`, data, { headers: this.headers }).pipe(
      map((res) => { this.isLoading.next(false); return res; })
    );
  }

  /**
   * Check the action type which comes back from dialog flow
   * @param actionType Type of the action
   */
  checkAction(actionType: string, params: any) {
    switch (actionType) {
      case 'search.places': {
        if (params.Location.length === 0) {
          break;
        }
        this.isLoading.next(true);
        this.places.getCoordinates(params.Location).subscribe((result: any) => {
          if (result.results.length > 0) {
            const location = `${result.results[0].geometry.location.lat},${result.results[0].geometry.location.lng}`;
            this.places.getLocations({
              location,
              type: params.EventType,
            }).subscribe((res: any) => {
              this.isLoading.next(false);
              this.listStartIndex = 0;
              this.listAmount = 5;
              this.locationsList = res.results;
              const locationsTrimmed = this.locationsList.length > this.listAmount ?
                this.locationsList.slice(this.listStartIndex, this.listStartIndex + this.listAmount) : this.locationsList;
              this.addMessageToChat('Das hier sind passende Orte:', true, locationsTrimmed);
              this.listStartIndex += locationsTrimmed.length;
            });
          }
        });
        break;
      }

      case 'search.places.more': {
        console.log(this.listStartIndex, this.locationsList.length);
        if (this.listStartIndex < this.locationsList.length) {
          // tslint:disable-next-line:max-line-length
          const amount = this.listStartIndex + this.listAmount < this.locationsList.length ? 5 : this.locationsList.length - this.listStartIndex;
          // tslint:disable-next-line:max-line-length
          console.log(`${this.listStartIndex} + ${this.listAmount} < ${this.locationsList.length} ? 5 : ${this.locationsList.length} - ${this.listStartIndex} = ${amount}`);
          this.addMessageToChat('Hier sind weitere:', true, this.locationsList.slice(this.listStartIndex, this.listStartIndex + amount));
          this.listStartIndex += amount;
        } else {
          this.addMessageToChat('Ich konnte leider keine weiteren Orte finden.', true);
        }

        break;
      }

      default:
        break;
    }
  }
}
