import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ChatService } from '../chat.service';
import { fadeIn } from '../../shared/animations/fadeIn';
import { Subject } from 'rxjs/Subject';
import { Location } from '../../models';

@Component({
  selector: 'app-chat-dialog',
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.scss'],
  animations: [fadeIn],
})
export class ChatDialogComponent implements OnInit, AfterViewChecked {

  constructor(private chatService: ChatService) { }

  chatMessages;
  possibleAnswers: Subject<string[]>;
  isLoading: Subject<boolean>;
  isLoadingPossibleAnswers: Subject<boolean>;

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  ngOnInit() {
    this.scrollToBottom();
    this.chatMessages = this.chatService.chatMessages;
    this.isLoading = this.chatService.isLoading;
    this.isLoadingPossibleAnswers = this.chatService.isLoadingPossibleAnswers;
    this.possibleAnswers = this.chatService.possibleAnswers;
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  /**
   * Always scroll chat window to the  to see latest chat messages.
   */
  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  /**
   * Add a user message to the chat log and send the message to dialogflow.
   * @param input Message text
   */
  sendMessage(input: string) {
    if (input === 'Meinen Standort bestimmen') {
      this.chatService.getMyLocation();
    } else {
      this.chatService.askBot(input);
    }
  }

  /**
   * Controller for the chat input element. Adds a chat message to the chat log.
   * @param input The input element of the chat window or a text string.
   */
  chatInputController(input: HTMLInputElement) {
    this.sendMessage(input.value);
    input.value = '';
  }
}
