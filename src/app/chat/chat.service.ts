import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class ChatService {
  readonly token = environment.dialogflow.eventsBot;
  private baseURL = 'https://api.dialogflow.com/v1/query?v=20150910';

  constructor(private readonly http: HttpClient) { }

  private get headers() {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });
  }

  getResponse(query: string) {
    console.log(this.token);
    const data = {
      'lang': 'de',
      'query': 'Was gibt es für Veranstaltungen?',
      'sessionId': '12345',
      'timezone': 'Europe/Madrid'
    };
    return this.http.post(`${this.baseURL}`, data, { headers: this.headers });
  }

}
