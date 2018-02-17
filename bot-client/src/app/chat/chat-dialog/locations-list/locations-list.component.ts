import { Component, OnInit, Input } from '@angular/core';
import { Location } from '../../../models';
import { ChatService } from '../../chat.service';

@Component({
  selector: 'app-locations-list',
  templateUrl: './locations-list.component.html',
  styleUrls: ['./locations-list.component.scss']
})
export class LocationsListComponent implements OnInit {

  @Input() locationsList: Location[];

  constructor(private chatService: ChatService) { }

  ngOnInit() {
  }

  showLocationDetails(location: Location) {
    this.chatService.showLocationDetails(location);
  }

}
