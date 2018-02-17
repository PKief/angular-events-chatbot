import { Component, OnInit, Input } from '@angular/core';
import { ChatService } from '../../chat.service';

@Component({
  selector: 'app-selection-list',
  templateUrl: './selection-list.component.html',
  styleUrls: ['./selection-list.component.scss']
})
export class SelectionListComponent implements OnInit {

  @Input() selectionList: string[];

  constructor(private chatService: ChatService) { }

  ngOnInit() {
  }

  sendMessage(value: string) {
    this.chatService.askBot(value);
  }

}
