import { Injectable, OnDestroy, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { onSnapshot, addDoc } from '@angular/fire/firestore';
import { collection } from '@firebase/firestore';
import { CurrentUserService } from './current-user.service';
import { DirectMessages } from '../interfaces/direct-messages.interface';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DirectMessagesService implements OnDestroy {

  firestore: Firestore = inject(Firestore);
  currentUserService: CurrentUserService = inject(CurrentUserService);

  allDirectMessages: any = [];
  allDirectMessages$ = new Subject;
  currentUser: any = [];

  unsubDirectMessages;
  unsubCurrentUser: any;
  activeDirectMessaging!: DirectMessages;


  init(): void {
    this.unsubCurrentUser = this.currentUserService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
    this.currentUserService.activeUser();
  }

  constructor() {
    this.unsubDirectMessages = this.subDirectMessages();
    this.init();
  }

  ngOnDestroy(): void {
    this.unsubDirectMessages();
    this.unsubCurrentUser.unsubscribe();
  }

  getActiveMessaging(paramsId: string) {
    if (this.allDirectMessages.paramsId)
      return this.allDirectMessages.paramsId
  }

  subDirectMessages() {
    return onSnapshot(this.getCollRef('direct_messages'), (list) => {
      this.allDirectMessages = [];
      list.forEach((element) => {
        this.allDirectMessages.push(this.addIdToList(element.data(), element.id));
      });
      this.allDirectMessages$.next(this.allDirectMessages);
    });
  }

  async getCurrentDirectMessages() {
    if (this.allDirectMessages) this.allDirectMessages$.next(this.allDirectMessages);
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
      if (this.currentUser.uid === uid) {
        if (doc.users[0] === uid && doc.users[1] === uid) docId = doc.id;
      }
      else if (doc.users.includes(this.currentUser.uid) && doc.users.includes(uid)) docId = doc.id;
    });
    if (docId != null) return docId;
    else {
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
    await addDoc(ref, {}).catch( // it can't be create a emty subcollection - here only with a emty json. After when I delete de doc(deleteDoc), the subcollection is also gone
      (err) => { console.log(err) }
    )
  }
}
