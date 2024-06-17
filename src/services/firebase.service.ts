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
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { LoginComponent } from '../app/start-screen/login/login.component';
import { setActiveConsumer } from '@angular/core/primitives/signals';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService implements OnDestroy {
  firestore: Firestore = inject(Firestore);
  channels: Channel[] = [];
  $channels = new BehaviorSubject<Channel[]>([]);
  unsubChannels;

  constructor() {
    this.unsubChannels = this.subChannelsList();
  }

  ngOnDestroy(): void {
    this.unsubChannels();
    this.$channels.unsubscribe();
  }

  /**
 * Uploads a file to Firebase Storage with a custom URL and metadata.
 * @param {any} file - The file to be uploaded.
 * @param {string} customURL - The custom URL path for the file in Firebase Storage.
 * @returns If the upload is successful, or rejects with an error.
 */
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

  /**
 * Retrieves the download URL and metadata for a file in Firebase Storage.
 * @param {string} path - The path to the file in Firebase Storage.
 * @returns The download URL and metadata of the file.
 */
  async getDownloadURL(
    path: string
  ): Promise<{ fileURL: string; metaData: any }> {
    const storage = getStorage();
    const pathReference = ref(storage, path);
    const fileURL = await getDownloadURL(pathReference);
    const metaData = await getMetadata(pathReference);
    return { fileURL, metaData };
  }

  /**
   * 
   * @returns return a snapshot on Firebase channel collection
   */
  subChannelsList() {
    return onSnapshot(this.getCollRef('channels'), (list) => {
      this.channels = [];
      list.forEach((element: any) => {
        this.channels.push(new Channel(element.data()));
      })
      this.$channels.next(this.channels);
    });
  }

  /**
 * Retrieves all channels from the Firestore database.
 * @returns An array of channel documents.
 */
  async getAllChannels() {
    const q = query(collection(this.firestore, 'channels'));
    let channels: any[] = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      channels.push(doc.data());
    });
    return channels;
  }

  /**
 * Updates an existing message in a specific channel.
 * @param {string} channelId - The ID of the channel where the message is located.
 * @param {string} messageId - The ID of the message to be updated.
 * @param {Message} msg - The updated message object.
 */
  updateMessage(channelId: string, messageId: string, msg: Message) {
    return setDoc(
      doc(this.firestore, 'channels', channelId, 'messages', messageId),
      msg.toJSON()
    );
  }

  /**
 * Updates a thread in a channel with the provided message.
 * @param {string} channelId - The ID of the channel where the thread is located.
 * @param {string} messageId - The ID of the message associated with the thread.
 * @param {string} threadId - The ID of the thread to be updated.
 * @param {Message} msg - The message object to be updated in the thread.
 */
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

  /**
 * Saves a new message to the Firestore database.
 * @param {string} id - The ID of the channel where the message will be saved.
 * @param {Message} msg - The message object to be saved.
 * @returns {string} Resolves the ID of the saved message document.
 */
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

  /**
 * Saves a new thread message to the Firestore database.
 * @param {string} id - The ID of the channel where the message belongs.
 * @param {string} msgId - The ID of the message to which the thread belongs.
 * @param {Message} msg - The message object to be saved as a thread.
 * @returns {string} Resolves the ID of the newly created thread document.
 */
  async saveNewThreadMessage(id: string, msgId: string, msg: Message) {
    const docRef = await addDoc(
      collection(this.firestore, 'channels', id, 'messages', msgId, 'threads'),
      msg.toJSON()
    );
    updateDoc(docRef, { id: docRef.id });
    return docRef.id.toString();
  }

  /**
 * Retrieves the messages in a thread associated with a specific message in a channel.
 * @param {string} channelId - The ID of the channel containing the message.
 * @param {string} messageId - The ID of the message for which to retrieve the thread messages.
 * @returns {messageId: string, threadList: DocumentData[]} Resolves an object containing the message ID and an array of thread messages.
 */
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

  /**
 * Retrieves all messages from a specific channel in Firestore.
 * @param {string} id - The ID of the channel to retrieve messages from.
 * @returns {DocumentData[]} That resolves an array of message documents.
 */
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

  /**
 * Retrieves a list of users from the Firestore database.
 * @returns That resolves an array of user data objects.
 */
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

  /**
 * Retrieves a channel document from Firestore based on the provided ID.
 * @param {string} id - The ID of the channel document to retrieve.
 * @returns {Channel} Resolves the channel document data.
 */
  async getChannel(id: string) {
    let docSnap = await getDoc(this.getDocRef('channels', id));
    return docSnap.data() as Channel;
  }

/**
 * Retrieves a direct message channel from Firestore based on the provided ID.
 * @param {string} id - The ID of the direct message channel to retrieve.
 * @returns {Channel | null} Resolves the Channel object if found, or null if not found.
 */
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

  /**
 * Updates a channel document in the Firestore database.
 * @param {any} channelData - The channel data to be updated.
 */
  updateChannel(channelData: any) {
    return setDoc(
      doc(this.firestore, 'channels', channelData.id),
      channelData.toJSON()
    );
  }

  /**
 * Updates a user document in the Firestore database.
 * @param {any} user - The user object to be updated.
 */
  updateUser(user: any) {
    return setDoc(doc(this.firestore, 'users', user.id), user.toJSON());
  }

  /**
   * 
   * @param colId collection id
   * @returns returns the firebase collection path
   */
  getCollRef(colId: string) {
    return collection(this.firestore, colId);
  }

  /**
   * 
   * @param colId collection id
   * @param docId document id
   * @returns returns the firebase documents path
   */
  getDocRef(colId: string, docId: string) {
    return doc(this.getCollRef(colId), docId);
  }
}
