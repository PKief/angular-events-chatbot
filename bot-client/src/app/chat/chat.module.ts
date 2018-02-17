import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from './chat.service';
import { ChatDialogComponent } from './chat-dialog/chat-dialog.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { ChatRoutingModule } from './chat-routing.module';
import { PlacesService } from './places.service';
import { LocationDetailComponent } from './chat-dialog/location-detail/location-detail.component';
import { LocationRatingComponent } from './chat-dialog/location-rating/location-rating.component';
import { LocationsListComponent } from './chat-dialog/locations-list/locations-list.component';
import { SelectionListComponent } from './chat-dialog/selection-list/selection-list.component';
import { FavoritesService } from './favorites.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    ChatRoutingModule,
  ],
  declarations: [
    ChatDialogComponent,
    LocationDetailComponent,
    LocationRatingComponent,
    LocationsListComponent,
    SelectionListComponent
  ],
  providers: [
    ChatService,
    PlacesService,
    FavoritesService
  ],
  exports: [ChatDialogComponent]
})
export class ChatModule { }
