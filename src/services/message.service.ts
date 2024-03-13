import { Injectable, inject } from '@angular/core';
import { Channel } from '../models/channel.class';
import { FirebaseService } from './firebase.service';
import { Message } from '../models/message.class';
import { Unsubscribe, collection, getDocs, query } from '@firebase/firestore';
import { Firestore, onSnapshot } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private fire: FirebaseService) {}
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

  mention: boolean = false;
  threadMention: boolean = false;
  currentUser: string = 'h4w3Cntmu2BmDuWSxKqt';

  firestore: Firestore = inject(Firestore);

  unsubMessages: Unsubscribe | undefined;
  unsubThreads: Unsubscribe | undefined;

  ngOnDestroy() {
    if (this.unsubMessages) {
      this.unsubMessages();
    }
    if (this.unsubThreads) {
      this.unsubThreads();
    }
  }

  subChannelThreads(channelId: string) {
    const messagesRef = collection(
      this.firestore,
      'channels',
      channelId,
      'messages'
    );
    this.unsubThreads = onSnapshot(messagesRef, (messagesSnapshot) => {
      messagesSnapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          this.subChannelSingleThread(channelId, change.doc.id);
        }
      });
    });
  }
  subChannelSingleThread(channelId: string, messageId: string) {
    const q = query(
      collection(
        this.firestore,
        'channels',
        channelId,
        'messages',
        messageId,
        'threads'
      )
    );
    this.unsubThreads = onSnapshot(q, (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        if (change.type === 'modified') {
          let threadData = { id: change.doc.id, ...change.doc.data() };
          this.setNewThread(threadData, messageId);
        }
      });
    });
  }

  subChannelMessages(channelId: string) {
    const q = query(
      collection(this.firestore, 'channels', channelId, 'messages')
    );
    this.unsubMessages = onSnapshot(q, (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        if (change.type === 'modified') {
          let messageData = { id: change.doc.id, ...change.doc.data() };
          this.setNewMessages(messageData);
        }
      });
    });
  }

  setNewThread(newMsg: any, messageId: string) {
    let foundIndex = -1;
    let threadIndex = -1;
    if (newMsg) {
      threadIndex = this.threadList.findIndex((msg: { messageId: string }) => {
        return msg.messageId === messageId;
      });
      foundIndex = this.threadList[threadIndex].threadList.findIndex(
        (msg: { id: string }) => {
          return msg.id === newMsg.id;
        }
      );
    }
    if (foundIndex === -1) {
      if (this.currentOpenMessageThreadId === messageId) {
        this.currentThread.push(newMsg);
        return this.getSortMessagesByTime(this.currentThread);
      } else {
        this.threadList[threadIndex].threadList.push(newMsg);
        return this.getSortMessagesByTime(
          this.threadList[threadIndex].threadList
        );
      }
    }
    return (this.threadList[threadIndex].threadList[foundIndex] = newMsg);
  }

  setNewMessages(newMsg: any) {
    let foundIndex = -1;
    if (newMsg) {
      foundIndex = this.sortedMessages.findIndex((msg) => {
        return msg.id === newMsg.id;
      });
    }
    if (foundIndex === -1) {
      this.sortedMessages.push(newMsg);
      return this.getSortMessagesByTime(this.sortedMessages);
    }

    return (this.sortedMessages[foundIndex] = newMsg);
  }

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
    // message.id = refId;

    // this.currentThread.push(message);
  }

  async saveAndAddNewMessage(message: Message) {
    let refId = await this.fire.saveNewMessage(this.currentChannel.id, message);
    // message.id = refId;
    // this.sortedMessages.push(message);
    // this.threadList.push([]);
  }

  setMessage(inputContent: string) {
    let content = inputContent;
    let time = this.getTimeStamp();
    inputContent = '';
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
      if (this.threadList.length === index) {
        let newThread = { messageId: messageId, threadList: [] };
        this.threadList.push(newThread);
      }
      this.currentThread = this.getSortMessagesByTime(
        this.threadList[index].threadList
      );
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

  getSortMessagesByTime(list: { timestamp: number }[]) {
    let sortetList = list.sort(
      (a: { timestamp: number }, b: { timestamp: number }) =>
        a.timestamp - b.timestamp
    );
    return sortetList;
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
