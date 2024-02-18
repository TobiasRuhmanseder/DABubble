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
   * Die Funktin bereitet für die Funktion renderDate() die params vor.
   * @param timestamp Der Zeitstempel, der in ein Datum umgewandelt werden soll.
   * @param index Der Index-Wert für die Formatierung des Datums.
   * @returns Das formatierte Datum entsprechend dem angegebenen Zeitstempel und Index.
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
   *  Die Funktion rendert das Datum basierend auf den angegebenen Parametern
   *  und gibt das gerenderte Datum zurück.
   * @param index Der Index-Wert für die Formatierung des Datums.
   * @param date Das Datum, das gerendert werden soll.
   * @param day Der Wochentag des Datums.
   * @param dateOfMonth Der Tag des Monats.
   * @param month Der Monat des Datums.
   * @param year Das Jahr des Datums.
   * @returns Das gerenderte Datum entsprechend den angegebenen Parametern.
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
}
