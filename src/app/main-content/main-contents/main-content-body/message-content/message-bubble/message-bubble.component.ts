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
  @Input() list: any;
  @Input() mainChat: any;
  abortEditMessage() {
    this.chatService.editFlaggIndex = -1;
  }
  saveEditMessage(index: number, mainChat: any) {
    debugger
    let editContent = this.checkIfThread(index, mainChat);
    if (this.list[index].content != editContent) {
      this.list[index].content = editContent;
      if (mainChat) {
        this.chatService.setMessageAndUpdate(index);
      } else {
        this.chatService.setThreadMessagesAndUpdate(index, this.msg.id);
      }
    }
    this.chatService.editFlaggIndex = -1;
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
