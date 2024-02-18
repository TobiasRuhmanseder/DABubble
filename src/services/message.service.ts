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
  editThreadFlaggIndex: number = -1;
  controllerId: any;
  threadIsOpen = false;
  isUploading = false;

  currentUser: string = 'h4w3Cntmu2BmDuWSxKqt';

  getSingleFile(fileIdList: any): any {
    return fileIdList.map(async (fileId: string) => {
      return this.handleDownload('msg_files/' + fileId, 5);
    });
  }

  async handleDownload(fileURL: string, maxRetries: number) {
    let retries = 0;
    let downloadResult = null;
    while (this.isUploading) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    while (retries < maxRetries) {
      try {
        downloadResult = await this.fire.getDownloadURL(fileURL);
        break;
      } catch {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        retries++;
      }
    }
    if (downloadResult) {
      return downloadResult;
    } else {
      throw new Error(
        'Maximale Anzahl von Wiederholungen erreicht. Download fehlgeschlagen.'
      );
    }
  }

  handleInvalidImageType() {
    console.log(
      'Erlaubte Dateiformate: PNG, JPEG und GIF. Bitte wähle eine gültige Datei aus.'
    );
  }

  async handleUpload(file: any, customURL: string) {
    this.isUploading = true;
    await this.fire.uploadToStorage(file, customURL);
    this.isUploading = false;
  }

  addReaction(reaction: string, index: number, list: any, mainChat: any) {
    let content = list[index];
    let user = this.currentUser;
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
    let refId = await this.fire.saveNewMessage(this.currentChannel.id, message);
    message.id = refId;
    this.sortedMessages.push(message);
    this.threadList.push([]);
  }

  setMessage(inputContent: string) {
    let content = inputContent;
    inputContent = '';
    let time = this.getTimeStamp();
    let message = new Message({
      senderId: this.currentUser,
      timestamp: time,
      content: content,
      id: '',
      answers: [],
      reactionNerd: [],
      reactionCheck: [],
      reactionRaising: [],
      reactionRocket: [],
      files: [],
    });
    return message;
  }

  setMessageAndUpdate(index: number) {
    let newMessage = new Message(this.sortedMessages[index]);
    this.fire.updateMessage(
      this.currentChannel.id,
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

  resetValues(channelId: string) {
    this.controllerId = channelId;
    this.messagesList = [];
    this.sortedMessages = [];
    this.threadList = [];
  }

  async getChannelFromId(id: string) {
    this.currentChannel = await this.fire.getChannel(id);
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
      this.currentThreadChannel = this.currentChannel;
      this.threadIsOpen = true;
    }
  }

  async getThreadMessages(channelId: string) {
    let dataList: any[] = [];
    for (const msg of this.messagesList) {
      if (channelId != this.controllerId) {
        return dataList;
      }
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
    return this.currentChannel.name;
  }

  getChannelUsers() {
    if (this.currentChannel === undefined) {
      return '';
    }
    return this.currentChannel.users;
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

  getMessageTime(timestamp: number) {
    let date = new Date(timestamp);
    let hours = ('0' + date.getHours()).slice(-2);
    let minutes = ('0' + date.getMinutes()).slice(-2);
    let timeText = hours + ':' + minutes;
    return timeText;
  }

  async saveChannel() {
    let updateChannel = new Channel(this.currentChannel);
    await this.fire.updateChannel(updateChannel);
  }
}
