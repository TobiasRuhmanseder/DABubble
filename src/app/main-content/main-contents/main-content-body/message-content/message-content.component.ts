import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MessageService } from '../../../../../services/message.service';
import { MessageTitleComponent } from './message-title/message-title.component';
import { MessageBubbleComponent } from './message-bubble/message-bubble.component';
import { MessageFooterComponent } from './message-footer/message-footer.component';

@Component({
  selector: 'app-message-content',
  standalone: true,
  templateUrl: './message-content.component.html',
  styleUrl: './message-content.component.scss',
  imports: [
    CommonModule,
    MessageTitleComponent,
    MessageBubbleComponent,
    MessageFooterComponent,
  ],
})
export class MessageContentComponent {
  isHover: any;
  constructor(public chatService: MessageService) {
  }
  @Input() mainChat:any;
}
