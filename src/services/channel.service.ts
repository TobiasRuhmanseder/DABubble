import { Injectable, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { onSnapshot, addDoc } from '@angular/fire/firestore';
import { collection } from '@firebase/firestore';
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

  async addNewChannel(channelData: Channel){
    console.log(channelData);
    
    await addDoc(this.getCollRef('channels'), channelData.toJSON()).catch(
    (err) => { console.log(err)}
  ).then((ref)=>{
    console.log('channel erfolgreich hinzugefügt ' + ref);
  }
  )
  }
}
