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

  private get headers() {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });
  }

  addMessageToChat(message, isBot: boolean) {
    this.chatMessages.next([...this.chatMessages.value, {
      id: Math.random(),
      text: message,
      bot: isBot,
      date: Date.now(),
    }]);
  }

  getResponse(query: string) {
    const data = {
      lang: 'de',
      query,
      sessionId: '12345',
      timezone: 'Europe/Madrid'
    };
    return this.http.post(`${this.baseURL}`, data, { headers: this.headers });
  }

  // showLocations() {
  //   this.places.getLocations({
  //     type: 'restaurant',
  //     location: '-33.8670522,151.1957362',
  //   }).subscribe(result => {
  //     console.log(result);
  //   });
  // }
}