import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MessageService } from '../../../../services/message.service';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MainContentComponent } from '../../main-content.component';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-main-content-body',
  standalone: true,
  imports: [CommonModule, TextFieldModule, MatMenuModule],
  templateUrl: './main-content-body.component.html',
  template: ` <textarea cdkTextareaAutosize></textarea> `,

  styleUrl: './main-content-body.component.scss',
})
export class MainContentBodyComponent {
  constructor(
    public chatService: MessageService,
    public mainContent: MainContentComponent
  ) {}

  editMessage(index: number) {
    setTimeout(() => {
      this.chatService.editFlaggIndex = index;
    }, 1);
  }
  abortEditMessage() {
    this.chatService.editFlaggIndex = -1;
  }
  saveEditMessage(index: number) {
    this.chatService.sortedMessages[index].msg = (
      document.getElementById('input_' + index) as HTMLTextAreaElement
    ).value;
    this.chatService.editFlaggIndex = -1;
  }
}
