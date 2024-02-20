import { Injectable, OnDestroy, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { onSnapshot } from '@angular/fire/firestore';
import { collection } from '@firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class DirectMessagesService implements OnDestroy {

  firestore: Firestore = inject(Firestore);
  allDirectMessages: any = [];
  unsubDirectMessages;

  constructor() {
    this.unsubDirectMessages = this.subDirectMessages();
  }

  ngOnDestroy(): void {
    this.unsubDirectMessages();
  }

  subDirectMessages() {
    return onSnapshot(this.getCollRef('direct_messages'), (list) => {
      this.allDirectMessages = [];
      list.forEach((element) => {
        this.allDirectMessages.push((element.data()));
      });
      console.log(this.allDirectMessages);
    });
  }

  getCollRef(colId: string) {
    return collection(this.firestore, colId);
  }

  getDocIdFromTheDirectMessaging() {

  }

  addNewDocIdDirectMessaging() {

  }
}
