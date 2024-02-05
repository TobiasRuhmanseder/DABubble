import { Component } from '@angular/core';
import { MessageService } from '../../../../services/message.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MainContentComponent } from '../../main-content.component';
import { IconHoverChangeImageComponent } from '../../../icon-hover-change-image/icon-hover-change-image.component';
import { FirebaseService } from '../../../../services/firebase.service';
import { Message } from '../../../../models/message.class';

@Component({
  selector: 'app-main-content-footer',
  standalone: true,
  templateUrl: './main-content-footer.component.html',
  styleUrl: './main-content-footer.component.scss',
  imports: [CommonModule, FormsModule, IconHoverChangeImageComponent],
})
export class MainContentFooterComponent {
  constructor(
    public chatService: MessageService,
    public mainContent: MainContentComponent,
    private fire: FirebaseService
  ) {}

  textareaContent: string = '';

  sendMessage() {
    let msg = this.textareaContent;
    let time = this.chatService.getTimeStamp();
    this.textareaContent = '';
    let message = new Message({
      senderId: this.chatService.eingeloggterUser,
      timestamp: time,
      content: msg,
      answers: [],
      reactionNerd: [],
      reactionCheck: [],
      reactionRaising: [],
      reactionRocket: [],
    });
    this.chatService.sortedMessages.push(message);
    this.fire.saveMessage(this.chatService.currentChannel[0].id, message);
    setTimeout(() => {
      this.mainContent.scrollDown();
    }, 1);
  }
}

