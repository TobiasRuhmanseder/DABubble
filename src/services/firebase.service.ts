import { Injectable, OnDestroy, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  getDocs,
  onSnapshot,
  setDoc,
} from '@angular/fire/firestore';
import { DocumentData, collection, doc, updateDoc } from '@firebase/firestore';
import { Channel } from '../models/channel.class';
import { Message } from '../models/message.class';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService implements OnDestroy {
  firestore: Firestore = inject(Firestore);

  channels: Channel[] = [];

  unsubChannels;

  constructor() {
    this.unsubChannels = this.subChannelsList();
  }

  ngOnDestroy(): void {
    this.unsubChannels();
  }

  subChannelsList() {
    return onSnapshot(this.getCollRef('channels'), (list) => {
      this.channels = [];
      list.forEach((element) => {
        this.channels.push(this.idToChannel(element.data(), element.id));
      });
    });
  }

  updateMessage(channelId: string, messageId: string, msg: Message) {
    return setDoc(
      doc(this.firestore, 'channels', channelId, 'messages', messageId),
      msg.toJSON()
    );
  }

  updateThread(
    channelId: string,
    messageId: string,
    threadId: string,
    msg: Message
  ) {
    return setDoc(
      doc(
        this.firestore,
        'channels',
        channelId,
        'messages',
        messageId,
        'threads',
        threadId
      ),
      msg.toJSON()
    );
  }

  async saveNewMessage(id: string, msg: Message) {
    const docRef = await addDoc(
      collection(this.firestore, 'channels', id, 'messages'),
      msg.toJSON()
    );
    updateDoc(docRef, { id: docRef.id });
    return docRef.id.toString();
  }

  async saveNewThreadMessage(id: string, msgId: string, msg: Message) {
    const docRef = await addDoc(
      collection(this.firestore, 'channels', id, 'messages', msgId, 'threads'),
      msg.toJSON()
    );
    updateDoc(docRef, { id: docRef.id });
    return docRef.id.toString();
  }

  async getThreadMessages(channelId: string, messageId: string) {
    let threadList: DocumentData[] = [];
    let querySnapshot = await getDocs(
      collection(
        this.firestore,
        'channels',
        channelId,
        'messages',
        messageId,
        'threads'
      )
    );
    querySnapshot.forEach((doc) => {
      let messageData = { id: doc.id, ...doc.data() };
      threadList.push(messageData);
    });
    return threadList;
  }

  async getChannelMessages(id: string) {
    let messagesList: DocumentData[] = [];
    let querySnapshot = await getDocs(
      collection(this.firestore, 'channels', id, 'messages')
    );
    querySnapshot.forEach((doc) => {
      let messageData = { id: doc.id, ...doc.data() };
      messagesList.push(messageData);
    });
    return messagesList;
  }

  async getUserList() {
    let userList: any[] = [];
    let querySnapshot = await getDocs(this.getCollRef('users'));
    querySnapshot.forEach((doc) => {
      let userData = { id: doc.id, ...doc.data() };
      userList.push(userData);
    });
    return userList;
  }

  updateChannel(channelData: any) {
    return setDoc(
      doc(this.firestore, 'channels', channelData.id),
      channelData.toJSON()
    );
  }

  // Add the id for the local Array Channels by onSnapshot
  idToChannel(obj: any, id: string): Channel {
    let channel: any = {
      id: id,
      name: obj.name || '',
      description: obj.description || '',
      creator: obj.creator || '',
      users: obj.users || '',
      messages: obj.messages || [],
    };
    return channel;
  }

  getCollRef(colId: string) {
    return collection(this.firestore, colId);
  }

  getDocRef(colId: string, docId: string) {
    return doc(this.getCollRef(colId), docId);
  }
}
