import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavService } from './sidenav/sidenav.service';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ThemingService } from './theming.service';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MaterialModule } from '../shared/material.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [
    SidenavComponent,
    ToolbarComponent
  ],
  providers: [
    SidenavService,
    ThemingService,
  ],
  exports: [
    SidenavComponent,
    ToolbarComponent,
  ]
})
export class CoreModule { }
