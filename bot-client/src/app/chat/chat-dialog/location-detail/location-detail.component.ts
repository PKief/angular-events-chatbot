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
    window.open(`https://www.google.com/maps/dir/?api=1&origin=${start ? start : ''}&destination=${end}&travelmode=driving`, '_blank');
  }

  showAddress() {
    this.chatService.addMessageToChat({
      bot: true,
      textAsHtml: this.location.formatted_address ? `<a href="https://www.google.com/maps/search/?api=1&query=${this.location.formatted_address}" target="_blank">${this.location.formatted_address}</a>` : 'Keine Angaben vorhanden!',
      title: 'Adresse',
    });
  }

  showPhone() {
    this.chatService.addMessageToChat({
      bot: true,
      textAsHtml: this.location.formatted_phone_number ? `<a href="tel:${this.location.formatted_phone_number}">${this.location.formatted_phone_number}</a>` : 'Keine Angaben vorhanden!',
      title: 'Kontakt',
    });
  }

  showOpeningHours() {
    let openingHours = '';
    if (this.location.opening_hours.weekday_text) {
      openingHours += '<ul>';
      this.location.opening_hours.weekday_text.forEach(t => {
        openingHours += `<li>
          ${t}
        </li>`
      })
      openingHours += '</ul>';
    }
    this.chatService.addMessageToChat({
      bot: true,
      textAsHtml: openingHours.length > 0 ? openingHours : 'Keine Angaben verfügbar!',
      title: 'Öffnungszeiten',
    });
  }
}
