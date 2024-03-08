import { Injectable, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { onSnapshot, addDoc } from '@angular/fire/firestore';
import { DocumentReference, collection, updateDoc } from '@firebase/firestore';
import { Channel } from '../models/channel.class';


@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  firestore: Firestore = inject(Firestore);

  constructor() { }


  getCollRef(colId: string) {
    return collection(this.firestore, colId);
  }

  async addNewChannel(channelData: Channel) {
    try {
      const docRef = await addDoc(this.getCollRef('channels'), channelData.toJSON());
      this.addIdToNewChannel(docRef);
      console.log('channel erfolgreich hinzugefügt ');
    } catch (e) {
      console.error(e);
    }
  }

  addIdToNewChannel(docRef: DocumentReference) {
    updateDoc(docRef, { id: docRef.id });
  }

}


