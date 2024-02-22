import { Injectable, OnDestroy, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { onSnapshot, addDoc, deleteDoc, doc } from '@angular/fire/firestore';
import { collection } from '@firebase/firestore';
import { CurrentUserService } from './current-user.service';
import { DirectMessages } from '../interfaces/direct-messages.interface';
import { Message } from '../models/message.class';

@Injectable({
  providedIn: 'root'
})
export class DirectMessagesService implements OnDestroy {

  firestore: Firestore = inject(Firestore);
  currentUserService: CurrentUserService = inject(CurrentUserService);
  allDirectMessages: any = [];
  currentUser: any = [];

  unsubDirectMessages;
  unsubCurrentUser: any;


  init(): void {
    this.unsubCurrentUser = this.currentUserService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
    this.currentUserService.activeUser();
    setTimeout(() => { //for the testing now 
    }, 2000
    )
  }

  constructor() {
    this.unsubDirectMessages = this.subDirectMessages();
    this.init();
  }


  ngOnDestroy(): void {
    this.unsubDirectMessages();
    this.unsubCurrentUser.unsubscribe();
  }

  subDirectMessages() {
    return onSnapshot(this.getCollRef('direct_messages'), (list) => {
      this.allDirectMessages = [];
      list.forEach((element) => {
        this.allDirectMessages.push(this.addIdToList(element.data(), element.id));
      });
    });
  }

  addIdToList(doc: any, id: any): DirectMessages {
    return {
      id: id || "",
      users: doc.users || []
    }
  }

  getCollRef(colId: string) {
    return collection(this.firestore, colId);
  }

  getDirectMessagingRef() {
    return collection(this.firestore, 'direct_messages');
  }

  async getDocIdFromTheDirectMessaging(uid: string) {
    let docId: any = null;
    this.allDirectMessages.forEach((doc: any) => {
      if (doc.users.includes(this.currentUser.uid) && doc.users.includes(this.currentUser.uid && uid)) {
        docId = doc.id;
      }
    });
    if (docId != null) {
      console.log(docId);
      return docId;
    } else {
      docId = await this.addNewDocDirectMessaging(uid);
      return docId;
    }
  }

  async addNewDocDirectMessaging(uid: string) {
    let newDoc = this.getEmtyDirectMessaging(uid);
    let docId;
    try {
      const docRef = await addDoc(this.getDirectMessagingRef(), newDoc)
      this.addMessageCollection(docRef?.id);
      console.log("Document written with ID: ", docRef?.id);
      return docRef.id
    }
    catch (err) {
      console.log(err);
      return err
    }
  }

  getEmtyDirectMessaging(uid: string): DirectMessages {
    return {
      users: [this.currentUser.uid, uid],
    }
  }

  async addMessageCollection(docRefId: any) {
    let path = 'direct_messages/' + docRefId + '/messages'
    let ref = collection(this.firestore, path);
    await addDoc(ref, {}).catch(   // it can't be create a emty subcollection - here only with a emty json. After when I delete de doc(deleteDoc), the subcollection is also gone
      (err) => { console.log(err) }
    )
  }
}
