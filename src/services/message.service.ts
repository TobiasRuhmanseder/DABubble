import { Injectable } from '@angular/core';
import { Channel } from '../models/channel.class';
import { FirebaseService } from './firebase.service';
import { DocumentData, getDoc } from 'firebase/firestore';
import { Message } from '../models/message.class';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private fire: FirebaseService) {}

  currentChannel: any;
  currentThread: any;

  messagesList: any[] = [];
  sortedMessages: any[] = [];

  threadList: any[] = [];

  editFlaggIndex: number = -1;
  threadIsOpen = true;

  eingeloggterUser: string = 'h4w3Cntmu2BmDuWSxKqt';
  setMessageAndUpdate(index: number) {
    let newMessage = new Message(this.sortedMessages[index]);
    this.fire.updateMessage(
      this.currentChannel[0].id,
      this.sortedMessages[index].id,
      newMessage
    );
  }

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
    this.sortedMessages = this.getSortMessagesByTime(this.messagesList);
    this.threadList = await this.getThreadMessages(id);
    // return this.messagesList;
  }

  setCurrentThread(index: number) {
    this.currentThread = this.threadList[index];
  }

  // ('NME25IW6lIFNuqfo4IrP','Iz9ByE5o3aoC8OQukKSl')
  async getThreadMessages(channelId: string) {
    let dataList: any[] = [];
    for (const msg of this.messagesList) {
      dataList.push(await this.fire.getThreadMessages(channelId, msg.id));
    }
    console.log('Thread geladen:', dataList);
    return dataList;
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
    this.sortedMessages = this.getSortMessagesByTime(this.messagesList);
    return this.sortedMessages;
  }

  // getSortThreads(list: { timestamp: number }[]) {
  //   this.sortedThread = this.sortMessagesByTime(list);
  //   return this.sortedThread;
  // }

  getSortMessagesByTime(list: { timestamp: number }[]) {
    this.sortedMessages = list.sort(
      (a: { timestamp: number }, b: { timestamp: number }) =>
        a.timestamp - b.timestamp
    );
    return this.sortedMessages;
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
    if (date.getDate() - new Date().getDate() === 1) {
      return 'Gestern';
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
