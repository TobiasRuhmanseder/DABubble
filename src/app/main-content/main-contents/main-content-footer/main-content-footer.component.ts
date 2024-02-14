import { Component, Input } from '@angular/core';
import { MessageService } from '../../../../services/message.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MainContentComponent } from '../../main-content.component';
import { IconHoverChangeImageComponent } from '../../../icon-hover-change-image/icon-hover-change-image.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';

@Component({
  selector: 'app-main-content-footer',
  standalone: true,
  templateUrl: './main-content-footer.component.html',
  styleUrl: './main-content-footer.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    IconHoverChangeImageComponent,
    PickerModule,
  ],
})
export class MainContentFooterComponent {
  @Input() mainChat: any;

  constructor(
    public chatService: MessageService,
    public mainContent: MainContentComponent
  ) {}

  textAreaContent: string = '';
  textAreaThreadContent: string = '';
  isEmojiPickerVisible: boolean = false;

  addEmoji(event: { emoji: { native: any } }, mainChat: any) {
    if (mainChat) {
      this.textAreaContent = `${this.textAreaContent}${event.emoji.native}`;
    } else {
      this.textAreaThreadContent = `${this.textAreaThreadContent}${event.emoji.native}`;
    }
    this.isEmojiPickerVisible = false;
  }
  getPlaceholderText(): string {
    return this.mainChat
      ? `Nachricht an # ${this.chatService.getChannelName()}`
      : 'Antworten...';
  }

  sendMessage() {
    if (this.mainChat) {
      let message = this.chatService.setMessage(this.textAreaContent);
      this.textAreaContent = '';
      this.chatService.saveAndAddNewMessage(message);
    } else {
      let message = this.chatService.setMessage(this.textAreaThreadContent);
      this.textAreaThreadContent = '';
      this.chatService.saveAndAddThreadMessage(message);
    }
  }
}
