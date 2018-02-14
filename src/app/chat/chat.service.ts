import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ChatService {
  readonly token = environment.dialogflow.eventsBot;
  private baseURL = 'https://api.dialogflow.com/v1/query?v=20150910';

  chatMessages: BehaviorSubject<any[]>;

  addMessageToChat(message, bot: boolean) {
    this.chatMessages.next([...this.chatMessages.value, {
      id: Math.random(),
      text: message,
      bot,
      date: Date.now(),
    }]);
  }

  constructor(private readonly http: HttpClient) {
    this.chatMessages = new BehaviorSubject([{
      id: Math.random(),
      text: 'Hi, was kann ich für dich tun?',
      bot: true,
      date: Date.now(),
    }]);
  }

  private get headers() {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });
  }

  getResponse(query: string) {
    const data = {
      'lang': 'de',
      'query': query,
      'sessionId': '12345',
      'timezone': 'Europe/Madrid'
    };
    return this.http.post(`${this.baseURL}`, data, { headers: this.headers });
  }
}
