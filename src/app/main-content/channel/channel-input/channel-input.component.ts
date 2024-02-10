import { Component } from '@angular/core';
import { MessageService } from '../../../../services/message.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-channel-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './channel-input.component.html',
  styleUrl: './channel-input.component.scss',
})
export class ChannelInputComponent {
  textareaThreadContent: string = '';
  constructor(private chatService: MessageService) {}
  sendMessage() {
    let message = this.chatService.setMessage(this.textareaThreadContent);
    this.chatService.saveAndAddThreadMessage(message);
  }
}
