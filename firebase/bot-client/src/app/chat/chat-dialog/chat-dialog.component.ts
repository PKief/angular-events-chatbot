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
  actionButtons: any[];

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  ngOnInit() {
    this.scrollTo();
    this.chatMessages = this.chatService.chatMessages;
    this.initial();
  }

  ngAfterViewChecked() {
    this.scrollTo();
  }

  /**
   * Always scroll chat window to the  to see latest chat messages.
   */
  scrollTo(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  /**
   * Initial chat message that comes from the bot.
   */
  private initial() {
    this.chatService.getResponse('Hallo').subscribe((r: any) => {
      this.chatService.addMessageToChat(r.result.fulfillment.speech, true);
      this.setActionButtons([
        { action: () => this.sendMessage('Ja'), text: 'Ja', value: 'yes' },
        { action: () => this.sendMessage('Nein'), text: 'Nein', value: 'no' },
      ]);
    });
  }

  sendMessage(input: string) {
    this.chatService.addMessageToChat(input, false);
    this.chatService.getResponse(input).subscribe((r: any) => {
      console.log(r);

      r.result.fulfillment.messages.forEach(message => {
        this.chatService.addMessageToChat(message.speech, true);
      });
    });
  }

  /**
   * Controller for the chat input element. Adds a chat message to the chat log-
   * @param input The input element of the chat window or a text string.
   */
  chatInputController(input: HTMLInputElement) {
    this.sendMessage(input.value);
    input.value = '';
  }

  /**
   * Set the action buttons.
   * @param buttons Array with the action buttons to be shown as possible answers for the user.
   */
  setActionButtons(buttons: any[]) {
    this.actionButtons = buttons;
  }
}
