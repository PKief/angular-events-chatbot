import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { PlacesService } from './places.service';

@Injectable()
export class ChatService {
  private readonly token = environment.dialogflow.eventsBot;
  private baseURL = 'https://api.dialogflow.com/v1/query?v=20150910';

  chatMessages: BehaviorSubject<any[]>;

  constructor(
    private readonly http: HttpClient,
    private readonly places: PlacesService,
  ) {
    this.chatMessages = new BehaviorSubject([]);
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
  addMessageToChat(message: string, isBot: boolean) {
    this.chatMessages.next([...this.chatMessages.value, {
      id: Math.random(),
      text: message,
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
    return this.http.post(`${this.baseURL}`, data, { headers: this.headers });
  }

  /**
   * Check the action type which comes back from dialog flow
   * @param actionType Type of the action
   */
  checkAction(actionType: string, params: any) {
    // console.log(actionType, params);
    switch (actionType) {
      case 'search.places': {
        this.places.getCoordinates(params.Location).subscribe((result: any) => {
          if (result.results.length > 0) {
            const location = `${result.results[0].geometry.location.lat},${result.results[0].geometry.location.lng}`;
            this.places.getLocations({
              location,
              type: params.EventType,
            }).subscribe(res => {
              console.log(res);
            });
          }
        });
        break;
      }

      default:
        break;
    }
  }
}
