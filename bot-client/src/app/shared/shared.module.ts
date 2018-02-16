import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatSidenavModule,
  MatToolbarModule,
  MatIconModule,
  MatMenuModule,
  MatFormFieldModule,
  MatInputModule
} from '@angular/material';

import { ContentComponent } from './content/content.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';

const modules = [
  MatButtonModule,
  MatCheckboxModule,
  MatSidenavModule,
  MatToolbarModule,
  MatIconModule,
  MatMenuModule,
  FlexLayoutModule,
  MatFormFieldModule,
  MatInputModule,
];

@NgModule({
  imports: [...modules],
  exports: [
    ...modules,
    ContentComponent,
    LoadingSpinnerComponent,
  ],
  declarations: [
    ContentComponent,
    LoadingSpinnerComponent
  ],
})
export class SharedModule { }
