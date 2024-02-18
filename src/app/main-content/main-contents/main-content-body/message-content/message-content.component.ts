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
  @Input() flagg: any;
  @Input() mainChat: any;
  @Input() list: any;
  constructor(public chatService: MessageService, public users: UsersService) {}
  months = [
    'Januar',
    'Februar',
    'März',
    'April',
    'Mai',
    'Juni',
    'Juli',
    'August',
    'September',
    'Oktober',
    'November',
    'Dezember',
  ];
  days = [
    'Sonntag',
    'Montag',
    'Dienstag',
    'Mittwoch',
    'Donnerstag',
    'Freitag',
    'Samstag',
  ];

  getFormattedDate(timestamp: number, index: number) {
    let date = new Date(timestamp);
    let day = this.days[date.getDay()];
    let dateOfMonth = date.getDate();
    let month = this.months[date.getMonth()];
    let year = date.getFullYear();
    return this.renderDate(index, date, day, dateOfMonth, month, year);
  }

  renderDate(
    index: number,
    date: Date,
    day: string,
    dateOfMonth: number,
    month: string,
    year: number
  ) {
    if (index < this.chatService.sortedMessages.length) {
      let now = new Date();
      let oneYear = now.getFullYear() - year;
      if (oneYear > 0) {
        return `${day} ${dateOfMonth}. ${month} ${year}`;
      }
    }
    if (date.getDate() === new Date().getDate()) {
      return 'Heute';
    }
    if (date.getDate() === new Date().getDate() - 1) {
      return 'Gestern';
    }
    return `${day} ${dateOfMonth}. ${month}`;
  }
}
