import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ChatService } from '../chat.service';
import { fadeIn } from '../../shared/animations/fadeIn';

@Component({
  selector: 'app-chat-dialog',
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.scss'],
  animations: [fadeIn],
})
export class ChatDialogComponent implements OnInit, AfterViewChecked {

  constructor(private chatService: ChatService) { }

  chatMessages;

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  ngOnInit() {
    this.scrollToBottom();
    this.chatMessages = this.chatService.chatMessages;
    this.initial();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  private initial() {
    this.chatService.getResponse('Hallo').subscribe((r: any) => {
      this.chatService.addMessageToChat(r.result.fulfillment.speech, true);
    });
  }

  sendMessage(input: HTMLInputElement) {
    this.chatService.addMessageToChat(input.value, false);
    this.chatService.getResponse(input.value).subscribe((r: any) => {
      console.log(r);

      r.result.fulfillment.messages.forEach(message => {
        this.chatService.addMessageToChat(message.speech, true);
      });
    });
    input.value = '';
  }
}

function delay(ms) {
  return new Promise(function (resolve, reject) {
    setTimeout(resolve, ms);
  });
}
