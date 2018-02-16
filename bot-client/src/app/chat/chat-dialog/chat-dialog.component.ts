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

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  ngOnInit() {
    this.scrollTo();
    this.chatMessages = this.chatService.chatMessages;
    this.initial();

    this.isLoading = this.chatService.isLoading;
    this.possibleAnswers = this.chatService.possibleAnswers;
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
      this.chatService.addMessageToChat({ text: r.result.fulfillment.speech, bot: true });
      this.chatService.possibleAnswers.next(['Ja', 'Nein', 'Wer bist du?']);
    });
  }

  /**
   * Add a user message to the chat log and send the message to dialogflow.
   * @param input Message text
   */
  sendMessage(input: string) {
    this.chatService.possibleAnswers.next([]);
    this.chatService.addMessageToChat({ text: input, bot: false });
    this.chatService.getResponse(input).subscribe((r: any) => {
      console.log(r);
      r.result.fulfillment.messages.forEach(message => {
        if (message.speech) {
          this.chatService.addMessageToChat({ text: message.speech, bot: true });
        }
        if (message.payload) {
          if (message.payload.response.types) {
            const list = message.payload.response.types;
            this.chatService.addMessageToChat({ text: message.speech, bot: true, selectList: list });
          }
          if (message.payload.response.possibleAnswers) {
            this.possibleAnswers.next(message.payload.response.possibleAnswers);
          }
        }
      });
      this.chatService.checkAction(r.result.action, r.result.parameters);
    });
  }

  /**
   * Controller for the chat input element. Adds a chat message to the chat log.
   * @param input The input element of the chat window or a text string.
   */
  chatInputController(input: HTMLInputElement) {
    this.sendMessage(input.value);
    input.value = '';
  }

  /**
   * Get the amount of stars for the rating bar of a location.
   * @param rating Rating as number
   */
  getRatingStars(rating: number) {
    const stars = [];
    const starsArray = rating ? rating.toString().split('.') : [0, 0];

    const amountFullStars = Number(starsArray[0]);
    let amountHalfStars = 0;
    let amountEmptyStars = 0;

    if (Number(starsArray[1]) >= 3 && Number(starsArray[1]) < 7) {
      amountHalfStars++;
    }

    amountEmptyStars = 5 - amountFullStars - amountHalfStars;

    stars.push(...Array(amountFullStars).fill(1));
    stars.push(...Array(amountHalfStars).fill(0));
    stars.push(...Array(amountEmptyStars).fill(-1));
    return stars;
  }

  showLocationDetails(location: Location) {
    this.chatService.showLocationDetails(location);
  }
}
