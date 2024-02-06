import { Injectable } from '@angular/core';
import { Channel } from '../models/channel.class';
import { FirebaseService } from './firebase.service';
import { getDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private fire: FirebaseService) {}

  currentChannel: any;
  messagesList: any[] = [];
  sortedMessages: any[] = [];
  editFlaggIndex: number = -1;
  threadIsOpen = true;

  eingeloggterUser: string = 'h4w3Cntmu2BmDuWSxKqt';

  resetValues() {
    this.messagesList = [];
    this.sortedMessages = [];
  }

  async getChannel(id: string) {
    let docRef = this.fire.getDocRef('channels', id);
    let docSnap = await getDoc(docRef);
    let data = docSnap.data() as Channel;
    this.currentChannel = [];
    this.currentChannel.push(data);
  }

  async getMessagesFromChannel(id: string) {
    this.messagesList = await this.fire.getChannelMessages(id);
    return this.messagesList;
  }

  toggleThread(index: number) {
    this.threadIsOpen = !this.threadIsOpen;
  }

  getUserById(id: string) {
    let users;
    return;
  }

  getTimeStamp() {
    let timestamp = new Date().getTime();
    return timestamp;
  }

  getChannelName() {
    if (this.currentChannel === undefined) {
      return '';
    }
    return this.currentChannel[0].name;
  }

  getChannelUsers() {
    if (this.currentChannel === undefined) {
      return '';
    }
    return this.currentChannel[0].users;
  }

  renderMessagePic(index: number) {
    // let user = this.usersTest.user.indexOf(this.sortedMessages[index].name);
    // let pic = this.usersTest.picURL[user];
    // return pic;
  }

  getSortMessages() {
    this.sortedMessages = this.sortMessagesByTime();
    return this.sortedMessages;
  }

  sortMessagesByTime() {
    return this.messagesList.sort(
      (a: { timestamp: number }, b: { timestamp: number }) =>
        a.timestamp - b.timestamp
    );
  }

  checkNextDay(index: number) {
    if (index === 0) {
      return true;
    }
    const currentTimestamp = new Date(
      Number(this.sortedMessages[index].timestamp)
    );
    const previousTimestamp = new Date(
      Number(this.sortedMessages[index - 1].timestamp)
    );
    return this.checkNextTime(currentTimestamp, previousTimestamp);
  }

  checkNextTime(currentTimestamp: Date, previousTimestamp: Date) {
    return (
      currentTimestamp.getFullYear() > previousTimestamp.getFullYear() ||
      currentTimestamp.getMonth() > previousTimestamp.getMonth() ||
      currentTimestamp.getDate() > previousTimestamp.getDate()
    );
  }

  renderDate(
    index: number,
    date: Date,
    day: string,
    dateOfMonth: number,
    month: string,
    year: number
  ) {
    if (index < this.sortedMessages.length) {
      let now = new Date();
      let oneYear = now.getFullYear() - year;
      if (oneYear > 0) {
        return `${day} ${dateOfMonth}. ${month} ${year}`;
      }
    }
    if (date.getDate() === new Date().getDate()) {
      return 'Heute';
    }
    return `${day} ${dateOfMonth}. ${month}`;
  }

  getFormattedDate(timestamp: number, index: number) {
    const months = [
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
    const days = [
      'Sonntag',
      'Montag',
      'Dienstag',
      'Mittwoch',
      'Donnerstag',
      'Freitag',
      'Samstag',
    ];

    let date = new Date(timestamp);
    let day = days[date.getDay()];
    let dateOfMonth = date.getDate();
    let month = months[date.getMonth()];
    let year = date.getFullYear();
    return this.renderDate(index, date, day, dateOfMonth, month, year);
  }
  getMessageTime(timestamp: number) {
    let date = new Date(timestamp);
    let timeText = date.getHours() + ':' + date.getMinutes();
    return timeText;
  }
}
