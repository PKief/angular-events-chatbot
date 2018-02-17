import { Injectable } from '@angular/core';
import { Location } from '../models';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class FavoritesService {

  favoriteList: BehaviorSubject<Location[]>;

  constructor() {
    this.favoriteList = new BehaviorSubject([]);
    try {
      const storage = localStorage.getItem('events-chatbot-favorites');
      if (storage) {
        this.favoriteList.next(JSON.parse(storage));
      }
    } catch (error) {
      console.error(error);
    }

    this.favoriteList.subscribe(list => {
      try {
        localStorage.setItem('events-chatbot-favorites', JSON.stringify(list));
      } catch (error) {
        console.error(error);
      }
    });
  }

  get favorites() {
    return this.favoriteList.value;
  }

  /** 
   * Add the current (selected) location to the favorites.
  */
  favorCurrentLocation(location: Location) {
    if (!this.isFavorite(location)) {
      this.favoriteList.next([...this.favorites, location]);
      return `${location.name} wurde zu deinen Favoriten hinzugefügt!`;
    } else {
      return `${location.name} gehört schon zu deinen Favoriten!`;
    }
  }

  /**
   * Remove a location from the favorites.
   * @param location Location object
   */
  removeFavorite(location: Location) {
    if (this.isFavorite(location)) {
      this.favoriteList.next(this.favorites.filter(f => f.id !== location.id));
      return `${location.name} wurde von deinen Favoriten gelöscht!`
    } else {
      return `${location.name} ist noch kein Favorit!`;
    }
  }

  /**
   * Is the location part of the favorites?
   * @param location Location object
   */
  isFavorite(location: Location) {
    return this.favorites.some(f => f.id === location.id);
  }

}
