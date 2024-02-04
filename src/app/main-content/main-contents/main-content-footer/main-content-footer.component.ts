import { Component } from '@angular/core';
import { MessageService } from '../../../../services/message.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MainContentComponent } from '../../main-content.component';
import { IconHoverChangeImageComponent } from '../../../icon-hover-change-image/icon-hover-change-image.component';

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
    public mainContent: MainContentComponent
  ) {}

  textareaContent: string = '';

  sendMessage() {
    let msg = this.textareaContent;
    let time = this.chatService.getTimeStamp();
    this.textareaContent = '';
    console.log(
      'Dies wird in den Channel gepusht:',
      'Message: ' + msg,
      'timestamp: ' + time,
      'currentUserId: ' + this.chatService.eingeloggterUser
    );
    this.chatService.sortedMessages.push({
      name: this.chatService.eingeloggterUser,
      message: msg,
      time: time,
      editing: false,
    });
    this.chatService.saveMessage();
    setTimeout(() => {
      this.mainContent.scrollDown();
    }, 1);
  }
}
