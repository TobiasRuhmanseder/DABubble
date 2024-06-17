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

  /**
   * Formats a given timestamp into a readable date string.
   * @param {number} timestamp - The timestamp to be formatted (in milliseconds).
   * @param {number} index - The index of the date in the list (used for rendering).
   * @returns {string} The formatted date string.
   */
  getFormattedDate(timestamp: number, index: number) {
    let date = new Date(timestamp);
    let day = this.days[date.getDay()];
    let dateOfMonth = date.getDate();
    let month = this.months[date.getMonth()];
    let year = date.getFullYear();
    return this.renderDate(index, date, day, dateOfMonth, month, year);
  }

  /**
   * Renders the date in a specific format based on the provided parameters.
   * @param {number} index - The index of the current message.
   * @param {Date} date - The date object to be rendered.
   * @param {string} day - The day of the week (e.g., "Monday", "Tuesday").
   * @param {number} dateOfMonth - The day of the month (e.g., 1, 2, 3, ..., 31).
   * @param {string} month - The name of the month (e.g., "January", "February").
   * @param {number} year - The year (e.g., 2023, 2024).
   * @returns {string} The formatted date string.
   */
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

  /**
   * Checks if the current timestamp is the next day compared to the previous timestamp.
   * @param {number} index - The index of the current item in the list.
   * @param {any[]} list - The list containing objects with a 'timestamp' property.
   * @returns {boolean} True if the current timestamp is the next day, false otherwise.
   */
  checkNextDay(index: number, list: any) {
    if (index === 0) {
      return true;
    }
    let currentTimestamp = new Date(Number(list[index].timestamp));
    let previousTimestamp = new Date(Number(list[index - 1].timestamp));
    return this.checkNextTime(currentTimestamp, previousTimestamp);
  }

  /**
   * Checks if the current timestamp is after the previous timestamp.
   * @param {Date} currentTimestamp - The current timestamp to be checked.
   * @param {Date} previousTimestamp - The previous timestamp to compare against.
   * @returns {boolean} Returns true if the current timestamp is after the previous timestamp, false otherwise.
   */
  checkNextTime(currentTimestamp: Date, previousTimestamp: Date) {
    return (
      currentTimestamp.getFullYear() > previousTimestamp.getFullYear() ||
      currentTimestamp.getMonth() > previousTimestamp.getMonth() ||
      currentTimestamp.getDate() > previousTimestamp.getDate()
    );
  }
}
