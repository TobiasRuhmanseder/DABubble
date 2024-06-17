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

  /**
 * Subscribes to the threads in a specific channel.
 * @param {string} channelId - The ID of the channel to subscribe to.
 */
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

  /**
 * Subscribes to a single thread in a channel and listens for changes.
 * @param {string} channelId - The ID of the channel containing the thread.
 * @param {string} messageId - The ID of the message associated with the thread.
 */
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

  /**
 * Subscribes to the messages subcollection of a specific channel and listens for changes.
 * When a message is modified, it updates the messages state with the new message data.
 * @param {string} channelId - The ID of the channel to subscribe to.
 */
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

  /**
 * Sets a new message in the appropriate thread list.
 * @param {any} newMsg - The new message object to be added.
 * @param {string} messageId - The ID of the message thread to which the new message belongs.
 * @returns {any[]} The updated thread list with the new message added.
 */
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

  /**
 * Sets a new message in the sortedMessages array.
 * @param {any} newMsg - The new message object to be added or updated.
 * @returns {any[]} The updated sortedMessages array, sorted by time.
 */
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

  /**
 * Retrieves a single file from a list of file IDs.
 * @param {any} fileIdList - A list of file IDs to retrieve.
 * @returns {any} That resolves an array of file data.
 */
  getSingleFile(fileIdList: any): any {
    return fileIdList.map(async (fileId: string) => {
      return this.handleDownload('msg_files/' + fileId, 5);
    });
  }

  /**
 * Handles the download of a file from a given URL.
 * @param {string} fileURL - The URL of the file to be downloaded.
 * @param {number} maxRetries - The maximum number of retries allowed for the download.
 * @returns {string | Error} That resolves the download URL or rejects with an error.
 */
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

  /**
 * Handles the upload of a file to the Firebase storage.
 * @param {any} file - The file to be uploaded.
 * @param {string} customURL - The custom URL for the file in the storage.
 * @returns That resolves when the file is uploaded.
 */
  async handleUpload(file: any, customURL: string) {
    this.isUploading = true;
    await this.fire.uploadToStorage(file, customURL);
    this.isUploading = false;
  }

  /**
 * Adds a reaction to a message in a list.
 * @param {string} reaction - The reaction to be added (e.g., '👍', '😂').
 * @param {number} index - The index of the message in the list.
 * @param {any} list - The list containing the messages.
 * @param {any} mainChat - A flag indicating whether the message is in the main chat or a thread.
 * @returns That resolves the updated message or thread messages.
 */
  addReaction(reaction: string, index: number, list: any, mainChat: any) {
    let content = list[index];
    let user = this.currentUser;
    this.updateReaction(reaction, content, user);
    if (mainChat) {
      return this.setMessageAndUpdate(index);
    }
    return this.setThreadMessagesAndUpdate(index, content.id);
  }

  /**
 * Updates the reaction for a given content and user.
 * @param {string} reaction - The reaction to update (e.g., 'Like', 'Dislike').
 * @param {any} content - The content object containing the reaction data.
 * @param {string} user - The user whose reaction needs to be updated.
 */
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

  /**
 * Saves a new message to the current open message thread and adds it to the thread channel.
 * @param {Message} message - The message object to be saved and added to the thread.
 * @returns {string} The reference ID of the saved message.
 */
  async saveAndAddThreadMessage(message: Message) {
    let refId = await this.fire.saveNewThreadMessage(
      this.currentThreadChannel.id,
      this.currentOpenMessageThreadId,
      message
    );
  }

  /**
 * Saves a new message to the database and adds it to the current channel.
 * @param {Message} message - The message object to be saved and added.
 */
  async saveAndAddNewMessage(message: Message) {
    let refId = await this.fire.saveNewMessage(this.currentChannel.id, message);
  }

  /**
 * Sets the message object with the provided input content and other necessary properties.
 * @param {string} inputContent - The content of the message.
 * @returns {Message} The constructed Message object.
 */
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

  /**
 * Sets a new message and updates it in the current channel.
 * @param {number} index - The index of the message to be updated in the sortedMessages array.
 */
  setMessageAndUpdate(index: number) {
    let newMessage = new Message(this.sortedMessages[index]);
    this.fire.updateMessage(
      this.currentChannel.id,
      this.sortedMessages[index].id,
      newMessage
    );
  }

  /**
 * Sets the messages for a specific thread and updates the thread.
 * @param {number} threadIndex - The index of the thread in the currentThread array.
 * @param {string} threadId - The ID of the thread to be updated.
 */
  setThreadMessagesAndUpdate(threadIndex: number, threadId: string) {
    let newThread = new Message(this.currentThread[threadIndex]);
    this.fire.updateThread(
      this.currentThreadChannel.id,
      this.currentOpenMessageThreadId,
      threadId,
      newThread
    );
  }

  /**
 * Resets the values of the class properties.
 * @param {string} channelId - The ID of the channel for which the values should be reset.
 */
  resetValues(channelId: string) {
    this.controllerId = channelId;
    this.messagesList = [];
    this.sortedMessages = [];
    this.threadList = [];
  }

  /**
 * Retrieves a channel object from the provided channel ID.
 * If the channel is a direct message channel, it fetches the direct message channel.
 * If the channel has users, it parses the users string into an array.
 * @param {string} id - The ID of the channel to retrieve.
 */
  async getChannelFromId(id: string) {
    this.currentChannel = await this.fire.getChannel(id);
    if (this.currentChannel === undefined) {
      this.currentChannel = await this.fire.getDirectMessagesChannel(id);
    } 
    else if (this.currentChannel.users.length != 0) {
      this.currentChannel.users = JSON.parse(this.currentChannel.users)
    }
  }

  /**
 * Retrieves messages from a specific channel and sorts them by time.
 * Also retrieves thread messages for the given channel.
 * @param {string} id - The ID of the channel to retrieve messages from.
 */
  async getMessagesFromChannel(id: string) {
    this.messagesList = await this.fire.getChannelMessages(id);
    this.sortedMessages = this.getSortMessagesByTime(this.messagesList);
    this.threadList = await this.getThreadMessages(id);
  }

  /**
 * Sets the current thread based on the provided index and message ID.
 * If the thread list is not empty and the index matches the length of the thread list,
 * a new thread is created and added to the thread list.
 * The current thread is set to the sorted messages of the thread at the given index.
 * The current open message thread ID, current thread channel, and thread open state are also updated.
 * @param {number} index - The index of the thread in the thread list.
 * @param {string} messageId - The ID of the message associated with the thread.
 */
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

  /**
 * Retrieves the messages from a thread in a given channel.
 * @param {string} channelId - The ID of the channel containing the thread.
 * @returns {any[]} A promise that resolves to an array of thread messages.
 */
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

  /**
 * Returns the current timestamp in milliseconds.
 * @returns {number} The current timestamp in milliseconds.
 */
  getTimeStamp() {
    let timestamp = new Date().getTime();
    return timestamp;
  }

  /**
 * Retrieves the name of the current channel.
 * @returns {string} The name of the current channel, or an empty string if the current channel is undefined or null.
 */
  getChannelName() {
    if (this.currentChannel === undefined || this.currentChannel === null) {
      return '';
    }
    return this.currentChannel.name;
  }

  /**
 * Sorts an array of objects with a 'timestamp' property in ascending order based on the timestamp value.
 * @param {Object[]} list - An array of objects with a 'timestamp' property of type number.
 * @returns {Object[]} The sorted array of objects.
 */
  getSortMessagesByTime(list: { timestamp: number }[]) {
    let sortetList = list.sort(
      (a: { timestamp: number }, b: { timestamp: number }) =>
        a.timestamp - b.timestamp
    );
    return sortetList;
  }

  /**
 * Converts a Unix timestamp to a formatted time string in 24-hour format.
 * @param {number} timestamp - The Unix timestamp to be converted.
 * @returns {string} The formatted time string in the format "HH:mm".
 */
  getMessageTime(timestamp: number) {
    let date = new Date(timestamp);
    let hours = ('0' + date.getHours()).slice(-2);
    let minutes = ('0' + date.getMinutes()).slice(-2);
    let timeText = hours + ':' + minutes;
    return timeText;
  }

  /**
 * Saves the current channel to the database.
 * @returns That resolves when the channel is saved.
 */
  async saveChannel() {
    let newChannel = this.currentChannel;
    newChannel.users = JSON.stringify(this.currentChannel.users);
    let updateChannel = new Channel(newChannel);
    await this.fire.updateChannel(updateChannel);
  }

}
