import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat-dialog',
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.sass']
})
export class ChatDialogComponent implements OnInit {

  constructor(private chatService: ChatService) { }

  ngOnInit() {
  }

  sendMessage() {
    this.chatService.getResponse('Event').subscribe(r => {
      console.log(r);
    });
  }

}
