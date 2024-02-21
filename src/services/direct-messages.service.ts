import { Injectable, OnDestroy, OnInit, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { onSnapshot } from '@angular/fire/firestore';
import { collection, collectionGroup } from '@firebase/firestore';
import { CurrentUserService } from './current-user.service';
import { DirectMessages } from '../interfaces/direct-messages.interface';

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
      this.getDocIdFromTheDirectMessaging('3kib1Ag4OvYZLG7EF0AKxM8TJjX2'); // start this function in the direct message component when click on a User  
    }, 2000
    )

  }

  constructor() {
    console.log('constructor starts');
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
        console.log(this.allDirectMessages);

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

  getDocIdFromTheDirectMessaging(uid: string) {
    this.allDirectMessages.forEach((doc: any) => {
      if (doc.users.includes(this.currentUser.uid) && doc.users.includes(this.currentUser.uid && uid)) {
        console.log(doc.id); //for testing now
      } else {
        console.log('false'); //for testing now
        this.addNewDocIdDirectMessaging();
      }
    });
  }

  addNewDocIdDirectMessaging() {
    // if it doesn't exist a direct messag doc on the firebase, here we will create one
    //if it done, start the getDocId.....again
  }
}
