import { Injectable } from '@angular/core';
import { Channel } from '../models/channel.class';
import { FirebaseService } from './firebase.service';
import { getDoc } from 'firebase/firestore';
import { Message } from '../models/message.class';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private fire: FirebaseService, private users: UsersService) {}

  currentChannel: any;
  currentThreadChannel: any;
  currentThread: any;
  currentOpenMessageThreadId: any;

  messagesList: any[] = [];
  sortedMessages: any[] = [];

  threadList: any[] = [];

  editFlaggIndex: number = -1;
  threadIsOpen = false;

  eingeloggterUser: string = 'h4w3Cntmu2BmDuWSxKqt';

  addReaction(reaction: string, index: number, list: any, mainChat: any) {
    let content = list[index];
    let user = this.eingeloggterUser;
    this.updateReaction(reaction, content, user);
    if (mainChat) {
      return this.setMessageAndUpdate(index);
    }
    return this.setThreadMessagesAndUpdate(index, content.id);
  }
  private updateReaction(reaction: string, content: any, user: string) {
    if (content[`reaction${reaction}`].includes(user)) {
      deleteUser();
    } else {
      addUser();
    }

    function addUser() {
      content[`reaction${reaction}`].push(user);
    }

    function deleteUser() {
      content[`reaction${reaction}`].splice(
        content[`reaction${reaction}`].indexOf(user),
        1
      );
    }
  }

  async saveAndAddThreadMessage(message: Message) {
    let refId = await this.fire.saveNewThreadMessage(
      this.currentThreadChannel.id,
      this.currentOpenMessageThreadId,
      message
    );
    message.id = refId;

    this.currentThread.push(message);
  }

  async saveAndAddNewMessage(message: Message) {
    let refId = await this.fire.saveNewMessage(
      this.currentChannel[0].id,
      message
    );
    message.id = refId;
    this.sortedMessages.push(message);
    this.threadList.push([]);
  }

  setMessage(inputContent: string) {
    let content = inputContent;
    let time = this.getTimeStamp();
    inputContent = '';
    let message = new Message({
      senderId: this.eingeloggterUser,
      timestamp: time,
      content: content,
      id: '',
      answers: [],
      reactionNerd: [],
      reactionCheck: [],
      reactionRaising: [],
      reactionRocket: [],
    });
    return message;
  }

  setMessageAndUpdate(index: number) {
    let newMessage = new Message(this.sortedMessages[index]);
    this.fire.updateMessage(
      this.currentChannel[0].id,
      this.sortedMessages[index].id,
      newMessage
    );
  }

  setThreadMessagesAndUpdate(threadIndex: number, threadId: string) {
    let newThread = new Message(this.currentThread[threadIndex]);
    this.fire.updateThread(
      this.currentThreadChannel.id,
      this.currentOpenMessageThreadId,
      threadId,
      newThread
    );
  }

  resetValues() {
    this.messagesList = [];
    this.sortedMessages = [];
    this.threadList = [];
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
  }

  setCurrentThread(index: number, messageId: string) {
    if (this.threadList.length != 0) {
      this.currentThread = this.getSortMessagesByTime(this.threadList[index]);
      this.currentOpenMessageThreadId = messageId;
      this.currentThreadChannel = this.currentChannel[0];
      this.threadIsOpen = true;
    }
  }

  async getThreadMessages(channelId: string) {
    let dataList: any[] = [];
    for (const msg of this.messagesList) {
      dataList.push(await this.fire.getThreadMessages(channelId, msg.id));
    }
    return dataList;
  }

  getUserPic(userId: any) {
    let user = this.users.getUserFromId(userId);
    if (user) {
      return user.photoURL;
    }
    return 'Profile';
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

  getSortMessages() {
    this.sortedMessages = this.getSortMessagesByTime(this.messagesList);
    return this.sortedMessages;
  }

  getSortMessagesByTime(list: { timestamp: number }[]) {
    let sortetList = list.sort(
      (a: { timestamp: number }, b: { timestamp: number }) =>
        a.timestamp - b.timestamp
    );
    return sortetList;
  }

  checkNextDay(index: number, list: any) {
    if (index === 0) {
      return true;
    }
    let currentTimestamp = new Date(Number(list[index].timestamp));
    let previousTimestamp = new Date(Number(list[index - 1].timestamp));
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
    let months = [
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
    let days = [
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
    let hours = ('0' + date.getHours()).slice(-2);
    let minutes = ('0' + date.getMinutes()).slice(-2);
    let timeText = hours + ':' + minutes;
    return timeText;
  }

  async saveChannel() {
    let updateChannel = new Channel(this.currentChannel[0]);
    await this.fire.updateChannel(updateChannel);
  }
}
