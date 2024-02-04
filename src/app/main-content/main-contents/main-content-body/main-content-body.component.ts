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
    this.chatService.channel1MsgTest[index].editing = true;
    setTimeout(() => {
      this.chatService.editFlagg = true;
    }, 1);
  }
  abortEditMessage(index: number) {
    this.chatService.channel1MsgTest[index].editing = false;
    this.chatService.editFlagg = false;
  }
  saveEditMessage(index: number) {
    this.chatService.channel1MsgTest[index].msg = (
      document.getElementById('input_' + index) as HTMLTextAreaElement
    ).value;
    this.chatService.channel1MsgTest[index].editing = false;
    this.chatService.editFlagg = false;
  }
}
