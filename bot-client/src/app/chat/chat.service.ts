import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { PlacesService } from './places.service';
import { Location, MessageConfig } from '../models';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { FavoritesService } from './favorites.service';

@Injectable()
export class ChatService {
  private readonly token = environment.dialogflow.eventsBot;
  private readonly baseURL = 'https://api.dialogflow.com/v1/query?v=20150910';

  chatMessages: BehaviorSubject<any[]>;
  possibleAnswers: BehaviorSubject<string[]>;
  locationsList: Location[];
  currentLocation: Location;
  private listStartIndex = 0;
  private listAmount = 4;

  usersAddress: string;
  isLoading: BehaviorSubject<boolean>;
  isLoadingPossibleAnswers: BehaviorSubject<boolean>;

  constructor(
    private readonly http: HttpClient,
    private readonly placesService: PlacesService,
    private readonly favoritesService: FavoritesService,
  ) {
    this.chatMessages = new BehaviorSubject([]);
    this.isLoading = new BehaviorSubject(true);
    this.isLoadingPossibleAnswers = new BehaviorSubject(false);
    this.possibleAnswers = new BehaviorSubject([]);
    this.initial();
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
   * Initial chat message that comes from the bot.
   */
  private initial() {
    this.getResponse('Hallo').subscribe((r: any) => {
      this.addMessageToChat({ text: r.result.fulfillment.speech, bot: true });
      this.possibleAnswers.next(['Ja', 'Nein', 'Wer bist du?']);
    });
  }

  /**
   * Ask the bot for something.
   * @param input Message text
   */
  askBot(input) {
    this.possibleAnswers.next([]);
    this.addMessageToChat({ text: input, bot: false });
    this.getResponse(input).subscribe((r: any) => {
      r.result.fulfillment.messages.forEach(message => {
        if (message.speech) {
          this.addMessageToChat({ text: message.speech, bot: true });
        }
        if (message.payload) {
          if (message.payload.response.types) {
            const list = message.payload.response.types;
            this.addMessageToChat({ text: message.speech, bot: true, selectionList: list });
          }
          if (message.payload.response.possibleAnswers) {
            this.possibleAnswers.next(message.payload.response.possibleAnswers);
          }
        }
      });
      this.checkAction(r.result.action, r.result.parameters);
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
      textAsHtml: options.textAsHtml,
      locationsList: options.locationsList,
      selectionList: options.selectionList,
      bot: options.bot,
      locationDetail: options.locationDetail,
      date: Date.now(),
      title: options.title,
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
      map((res) => { this.isLoading.next(false); return res; }),
      catchError(this.handleError('getResponse', []))
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
        const addressSuggestions = ['Meinen Standort bestimmen']
        if (this.usersAddress && this.usersAddress.length > 0) {
          addressSuggestions.push(this.usersAddress);
        }
        this.possibleAnswers.next(addressSuggestions);
        if (!params.Location) {
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

      case 'add.location.to.favorites': {
        this.addMessageToChat({
          bot: true,
          text: this.favoritesService.favorCurrentLocation(this.currentLocation),
        });
        this.possibleAnswers.next(['Meine Favoriten anzeigen']);
        break;
      }

      case 'remove.location.from.favorites': {
        this.addMessageToChat({
          bot: true,
          text: this.favoritesService.removeFavorite(this.currentLocation),
        });
        this.possibleAnswers.next(['Meine Favoriten anzeigen']);
        break;
      }

      case 'show.favorites': {
        this.addMessageToChat({
          bot: true,
          text: `Du hast ${this.favoritesService.favorites.length} Favoriten`,
          locationsList: this.favoritesService.favorites,
        });
        this.possibleAnswers.next(['Finde Alternativen']);
        break;
      }

      default:
        break;
    }
  }

  /**
   * Get the locations by the given parameters.
   */
  private getLocations(params: any) {
    this.isLoading.next(true);
    this.placesService.getCoordinates(params.Location).subscribe((coords: any) => {
      if (coords.results.length > 0) {
        const location = `${coords.results[0].geometry.location.lat},${coords.results[0].geometry.location.lng}`;
        this.placesService.getLocations({
          location,
          type: params.EventType,
          keyword: params.EventKeyword,
        }).subscribe(res => this.handleGetLocations(res));
      }
    });
  }

  /**
   * Prepare the list of places to view in the chat.
   * @param res Locations list from the api.
   */
  private handleGetLocations(res: any) {
    this.isLoading.next(false);
    this.listStartIndex = 0;
    this.listAmount = 5;
    this.locationsList = res.results;

    const locationsTrimmed = this.locationsList.length > this.listAmount ?
      this.locationsList.slice(this.listStartIndex, this.listStartIndex + this.listAmount) : this.locationsList;

    if (this.locationsList.length > 0) {
      this.addMessageToChat({
        text: 'Das hier sind passende Orte:',
        bot: true,
        locationsList: locationsTrimmed
      });
      this.possibleAnswers.next(['Weitere anzeigen', 'Vielen Dank']);
      this.listStartIndex += locationsTrimmed.length;
    } else {
      this.addMessageToChat({
        text: 'Ich konnte leider keine Orte finden 😕',
        bot: true,
      });
      this.possibleAnswers.next(['Etwas anderes machen']);
    }
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
      this.possibleAnswers.next(['Weitere anzeigen', 'Vielen Dank']);
      this.listStartIndex += amount;
    } else {
      this.addMessageToChat({
        text: 'Ich konnte leider keine weiteren Orte finden.',
        bot: true
      });
      this.possibleAnswers.next(['Danke', 'Etwas anderes machen']);
    }
  }

  /**
   * Show the user further details about a location.
   * @param location location object
   */
  showLocationDetails(location: Location) {
    this.isLoading.next(true);
    this.placesService.getLocationDetail(location.place_id).subscribe((response: any) => {
      if (this.favoritesService.isFavorite(location)) {
        this.possibleAnswers.next(['Aus Favoriten entfernen ❌️']);
      } else {
        this.possibleAnswers.next(['Favorisieren', 'Alternativen zeigen']);
      }
      this.isLoading.next(false);
      this.currentLocation = response.result;
      this.addMessageToChat({
        bot: true,
        locationDetail: response.result,
      });
    });
  }

  /** 
   * Find out location of the user.
  */
  getMyLocation() {
    this.possibleAnswers.next([]);
    this.isLoadingPossibleAnswers.next(true);

    return new Promise((resolve, reject) => {
      this.placesService.getGeoLocation().then(coords => {
        this.placesService.getCoordinates(`${coords.latitude},${coords.longitude}`).subscribe(result => {
          const address = result['results'][0]['formatted_address'];
          this.usersAddress = address;
          this.isLoadingPossibleAnswers.next(false);
          this.possibleAnswers.next([address]);
          resolve(address);
        });
      }).catch(err => {
        this.isLoadingPossibleAnswers.next(false);
        console.error(err);
        reject(err);
      });
    })
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
