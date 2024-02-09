import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MessageService } from '../../../../../../services/message.service';
import { TextFieldModule } from '@angular/cdk/text-field';

@Component({
  selector: 'app-message-bubble',
  standalone: true,
  imports: [CommonModule, TextFieldModule],
  templateUrl: './message-bubble.component.html',
  styleUrl: './message-bubble.component.scss',
  template: ` <textarea cdkTextareaAutosize></textarea> `,
})
export class MessageBubbleComponent {
  constructor(public chatService: MessageService) {}

  @Input() msg: any;
  @Input() i: any;
  @Input() isHover: any;

  abortEditMessage() {
    this.chatService.editFlaggIndex = -1;
  }
  saveEditMessage(index: number) {
    let editContent = (
      document.getElementById('input_' + index) as HTMLTextAreaElement
    ).value;
    if (this.chatService.sortedMessages[index].content != editContent) {
      this.chatService.sortedMessages[index].content = editContent;
      this.chatService.setMessageAndUpdate(index);
    }
    this.chatService.editFlaggIndex = -1;
  }
}
