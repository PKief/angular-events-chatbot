import { Component, OnInit, HostBinding, OnDestroy } from '@angular/core';
import { ThemingService } from './core/theming.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  themingSubscription: Subscription;

  constructor(private theming: ThemingService) { }

  @HostBinding('class') public cssClass;

  ngOnInit() {
    this.themingSubscription = this.theming.theme.subscribe(theme => {
      this.cssClass = theme;
    });
  }

  ngOnDestroy() {
    this.themingSubscription.unsubscribe();
  }
}
