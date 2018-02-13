import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatSidenavModule,
  MatToolbarModule,
  MatIconModule,
  MatMenuModule
} from '@angular/material';

import { ContentComponent } from './content/content.component';

const modules = [
  MatButtonModule,
  MatCheckboxModule,
  MatSidenavModule,
  MatToolbarModule,
  MatIconModule,
  MatMenuModule,
  FlexLayoutModule,
];

@NgModule({
  imports: [...modules],
  exports: [
    ...modules, ContentComponent
  ],
  declarations: [
    ContentComponent
  ],
})
export class SharedModule { }
