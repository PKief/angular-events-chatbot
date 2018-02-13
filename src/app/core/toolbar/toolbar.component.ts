import { Component, OnInit } from '@angular/core';
import { SidenavService } from '../sidenav/sidenav.service';
import { ThemingService } from '../theming.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  themes: string[];

  constructor(
    private sidenavService: SidenavService,
    private theming: ThemingService
  ) { }

  ngOnInit() {
    this.themes = this.theming.themes;
  }

  changeTheme(theme) {
    this.theming.changeTheme(theme);
  }

  toggleSidenav() {
    this.sidenavService.toggle();
  }
}
