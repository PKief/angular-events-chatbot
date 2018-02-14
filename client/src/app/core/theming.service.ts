import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ThemingService {
  themes = ['default-theme', 'black-theme', 'light-theme'];
  theme: Subject<string> = new Subject();

  constructor() {
    this.theme.next('default-theme');
  }

  changeTheme(theme: string) {
    if (this.themes.indexOf(theme) !== -1) {
      this.theme.next(theme);
    }
  }
}
