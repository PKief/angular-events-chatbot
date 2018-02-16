import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { PlacesService } from './places.service';
import { Location, MessageConfig } from '../models';
import { map } from 'rxjs/operators/map';

@Injectable()
export class ChatService {
  private readonly token = environment.dialogflow.eventsBot;
  private readonly baseURL = 'https://api.dialogflow.com/v1/query?v=20150910';

  chatMessages: BehaviorSubject<any[]>;
  possibleAnswers: BehaviorSubject<string[]>;
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
    this.possibleAnswers = new BehaviorSubject([]);
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
  addMessageToChat(options: MessageConfig) {
    this.chatMessages.next([...this.chatMessages.value, {
      id: Math.random(),
      text: options.text,
      locationsList: options.locationsList,
      selectList: options.selectList,
      bot: options.bot,
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
      // search locations
      case 'search.places': {
        if (params.Location.length === 0) {
          break;
        }
        this.getLocations(params);
        break;
      }

      // get more locations from the results array
      case 'search.places.more': {
        this.getMoreLocations();
        break;
      }

      default:
        break;
    }
  }

  /**
   * Get the locations by the given parameters.
   */
  private getLocations(params) {
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
          this.addMessageToChat({
            text: 'Das hier sind passende Orte:',
            bot: true,
            locationsList: locationsTrimmed
          });
          this.addMessageToChat({
            text: 'Frage nach weiteren, wenn du noch mehr brauchst!',
            bot: true,
          });
          this.possibleAnswers.next(['Zeige weitere', 'Vielen Dank']);
          this.listStartIndex += locationsTrimmed.length;
        });
      }
    });
  }

  /**
   * Show more results in the chat.
   */
  getMoreLocations() {
    if (this.locationsList && this.listStartIndex < this.locationsList.length) {
      const amount = this.listStartIndex + this.listAmount < this.locationsList.length ? 5
        : this.locationsList.length - this.listStartIndex;
      this.addMessageToChat({
        text: 'Hier sind weitere:',
        bot: true,
        locationsList: this.locationsList.slice(this.listStartIndex, this.listStartIndex + amount)
      });
      this.listStartIndex += amount;
    } else {
      this.addMessageToChat({
        text: 'Ich konnte leider keine weiteren Orte finden.',
        bot: true
      });
    }
  }
}
