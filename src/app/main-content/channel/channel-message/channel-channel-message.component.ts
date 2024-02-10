import { Component } from '@angular/core';
import { MessageContentComponent } from '../../main-contents/main-content-body/message-content/message-content.component';
import { MessageService } from '../../../../services/message.service';

@Component({
  selector: 'app-channel-channel-message',
  standalone: true,
  templateUrl: './channel-channel-message.component.html',
  styleUrl: './channel-channel-message.component.scss',
  imports: [MessageContentComponent],
})
export class ChannelChannelMessageComponent {
  constructor(public chatService: MessageService) {}
}
