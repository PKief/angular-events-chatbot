import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ThemingService {
  themes = ['default-theme', 'black-theme', 'light-theme'];
  theme: BehaviorSubject<string> = new BehaviorSubject('default-theme');

  constructor() {
    const theme = localStorage.getItem('event-chatbot-theme');
    if (theme) {
      this.theme.next(theme);
    }
  }

  changeTheme(theme: string) {
    if (this.themes.indexOf(theme) !== -1) {
      this.theme.next(theme);
      localStorage.setItem('event-chatbot-theme', theme);
    }
  }
}
