import { Injectable, OnDestroy, inject } from '@angular/core';
import { Firestore, onSnapshot } from '@angular/fire/firestore';
import { collection, doc } from '@firebase/firestore';
import { Channel } from '../models/channel.class';


@Injectable({
  providedIn: 'root'
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
      list.forEach(element => {
        this.channels.push(this.idToChannel(element.data(), element.id))
      });
    });

  }
  // Add the id for the local Array Channels by onSnapshot
  idToChannel(obj: any, id: string): Channel {
    let channel: any ={
      id: id,
      name: obj.name || '',
      description: obj.description || '',
      creator: obj.creator || '',
      users: obj.users || '',
      messages: obj.messages || []
  }
  return channel
  }

  getCollRef(colId: string) {
    return collection(this.firestore, colId);
  }


  getDocRef(colId: string, docId: string) {
    return doc(this.getCollRef(colId), docId);
  }
}
