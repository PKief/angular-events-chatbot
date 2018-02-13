import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatSidenavModule,
  MatToolbarModule,
  MatIconModule,
  MatMenuModule
} from '@angular/material';

const modules = [
  MatButtonModule,
  MatCheckboxModule,
  MatSidenavModule,
  MatToolbarModule,
  MatIconModule,
  MatMenuModule,
];

@NgModule({
  imports: [...modules],
  exports: [...modules],
})
export class MaterialModule { }
