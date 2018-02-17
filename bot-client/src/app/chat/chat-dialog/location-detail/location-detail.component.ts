import { Component, OnInit, Input } from '@angular/core';
import { Location } from '../../../models';
import { ChatService } from '../../chat.service';

@Component({
  selector: 'app-location-detail',
  templateUrl: './location-detail.component.html',
  styleUrls: ['./location-detail.component.scss']
})
export class LocationDetailComponent implements OnInit {

  @Input() location: Location;

  constructor(private readonly chatService: ChatService) { }

  ngOnInit() {
  }

  openApproach() {
    const start = this.chatService.usersAddress;
    const end = this.location['formatted_address'];
    window.open(`https://www.google.com/maps/dir/?api=1&origin=${start}&destination=${end}&travelmode=driving`, '_blank');
  }

  showDetailInformation(title: string, information: string) {
    this.chatService.addMessageToChat({
      bot: true,
      text: information ? information : 'Keine Angaben gefunden!',
      title,
    });
  }

}
