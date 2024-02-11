import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MessageService } from '../../../../../services/message.service';
import { MessageTitleComponent } from './message-title/message-title.component';
import { MessageBubbleComponent } from './message-bubble/message-bubble.component';
import { MessageFooterComponent } from './message-footer/message-footer.component';
import { UserPicComponent } from '../../../../user-pic/user-pic.component';
import { UsersService } from '../../../../../services/users.service';

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
    UserPicComponent,
  ],
})
export class MessageContentComponent {
  isHover: any;
  @Input() mainChat: any;
  @Input() list: any;
  constructor(public chatService: MessageService, public users: UsersService) {}


}
