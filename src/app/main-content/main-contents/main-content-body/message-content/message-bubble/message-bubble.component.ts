import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MessageService } from '../../../../../../services/message.service';
import { TextFieldModule } from '@angular/cdk/text-field';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-message-bubble',
  standalone: true,
  imports: [CommonModule, TextFieldModule, FormsModule, PickerModule],
  templateUrl: './message-bubble.component.html',
  styleUrl: './message-bubble.component.scss',
})
export class MessageBubbleComponent {
  constructor(public chatService: MessageService) {}
  isEmojiPickerVisible: boolean = false;

  @Input() flagg: any;

  @Input() msg: any;
  @Input() i: any;
  @Input() isHover: any;
  @Input() list: any;
  @Input() mainChat: any;

  abortEditMessage() {
    this.chatService.editFlaggIndex = -1;
    this.chatService.editThreadFlaggIndex = -1;
  }
  saveEditMessage(index: number, mainChat: any) {
    let editContent = this.checkIfThread(index, mainChat);
    if (this.list[index].content != editContent) {
      this.list[index].content = editContent;
      if (mainChat) {
        this.chatService.setMessageAndUpdate(index);
      } else {
        this.chatService.setThreadMessagesAndUpdate(index, this.msg.id);
      }
    }
    this.abortEditMessage();
  }
  addEmoji(event: { emoji: { native: any } }) {
    this.msg.content = `${this.msg.content}${event.emoji.native}`;
    this.isEmojiPickerVisible = false;
  }

  checkIfThread(index: number, mainChat: any) {
    if (mainChat) {
      return (document.getElementById('input_' + index) as HTMLTextAreaElement)
        .value;
    }
    return (
      document.getElementById('inputThread_' + index) as HTMLTextAreaElement
    ).value;
  }
}
