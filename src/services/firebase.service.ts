import { Injectable, OnDestroy, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  getDocs,
  onSnapshot,
  setDoc,
} from '@angular/fire/firestore';
import {
  DocumentData,
  collection,
  doc,
  getDoc,
  query,
  updateDoc,
} from '@firebase/firestore';
import { Channel } from '../models/channel.class';
import { Message } from '../models/message.class';
import {
  getDownloadURL,
  getMetadata,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { Subject } from 'rxjs';
import { LoginComponent } from '../app/start-screen/login/login.component';
import { setActiveConsumer } from '@angular/core/primitives/signals';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService implements OnDestroy {
  firestore: Firestore = inject(Firestore);
  channels: Channel[] = [];
  $channels = new Subject;
  unsubChannels;

  constructor() {
    this.unsubChannels = this.subChannelsList();
  }

  ngOnDestroy(): void {
    this.unsubChannels();
    this.$channels.unsubscribe();
  }

  async uploadToStorage(file: any, customURL: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        let storage = getStorage();
        let storageRef = ref(storage, 'msg_files/' + customURL);
        const metadata = {
          customMetadata: {
            originalName: file.name,
          },
        };
        uploadBytes(storageRef, file, metadata)
          .then(() => {
            resolve(true); // Upload erfolgreich abgeschlossen
          })
          .catch((error) => {
            reject(error); // Fehler beim Upload
          });
      } catch (error) {
        reject(error); // Fehler beim Upload
      }
    });
  }

  async getDownloadURL(
    path: string
  ): Promise<{ fileURL: string; metaData: any }> {
    const storage = getStorage();
    const pathReference = ref(storage, path);
    const fileURL = await getDownloadURL(pathReference);
    const metaData = await getMetadata(pathReference);
    return { fileURL, metaData };
  }

  subChannelsList() {
    return onSnapshot(this.getCollRef('channels'), async (list) => {

      this.channels = [];
      list.forEach(async (element: any) => {
        this.channels.push(new Channel(element.data()));
      })
      this.$channels.next(this.channels);
    });
  }

  async getAllChannels() {
    const q = query(collection(this.firestore, 'channels'));
    let channels: any[] = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      channels.push(doc.data());
    });
    return channels;
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
    updateDoc(docRef, {
      id: docRef.id
    });
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
      threadList.push({ id: doc.id, ...doc.data() });
    });
    return { messageId, threadList };
  }

  async getChannelMessages(id: string) {
    let messagesList: DocumentData[] = [];
    let querySnapshot = await getDocs(
      collection(this.firestore, 'channels', id, 'messages')
    );
    querySnapshot.forEach((doc) => {
      messagesList.push({ id: doc.id, ...doc.data() });
    });
    return messagesList;
  }

  async getUserList() {
    let userList: any[] = [];
    let querySnapshot = await getDocs(this.getCollRef('users'));
    querySnapshot.forEach((doc) => {
      let userData = doc.data();
      userData['id'] = doc.id;
      userList.push(userData);
    });
    return userList;
  }

  async getChannel(id: string) {
    let docSnap = await getDoc(this.getDocRef('channels', id));
    return docSnap.data() as Channel;
  }

  async getDirectMessagesChannel(id: string) {
    let docSnap = await getDoc(this.getDocRef('direct_messages', id));
    let channelData = docSnap.data();

    if (channelData) {
      // ID hinzufügen und Namen ändern
      const channel: Channel = {
        id: id,
        name: id,
        description: '',
        creator: '',
        users: channelData['users'],
        messages: [],
        toJSON: function (): {
          id: string;
          name: string;
          description: string;
          creator: string;
          users: string[];
          messages: []
        } {
          throw new Error('Function not implemented.');
        },
      };

      return channel;
    } else {
      return null; // Oder eine entsprechende Behandlung für den Fall, dass keine Daten vorhanden sind
    }
  }

  updateChannel(channelData: any) {
    return setDoc(
      doc(this.firestore, 'channels', channelData.id),
      channelData.toJSON()
    );
  }

  updateUser(user: any) {
    return setDoc(doc(this.firestore, 'users', user.id), user.toJSON());
  }

  // Add the id for the local Array Channels by onSnapshot

  idToChannel(obj: any, id: string): Channel {
    let usersParse;
    if (typeof obj.users === 'string') {
      usersParse = JSON.parse(obj.users);
    }
    let channel: any = {
      id: id,
      name: obj.name || '',
      description: obj.description || '',
      creator: obj.creator || '',
      users: usersParse || [],
      messages: obj.messages || [],
    };
    console.log(channel);

    return channel;
  }

  getCollRef(colId: string) {
    return collection(this.firestore, colId);
  }

  getDocRef(colId: string, docId: string) {
    return doc(this.getCollRef(colId), docId);
  }
}
