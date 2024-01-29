import { Injectable, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore/firebase';
import { collection, doc } from '@firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseServiceService {
  firestore: Firestore = inject(Firestore);

  constructor() { }


  getCollRef(colId: string) {
    return collection(this.firestore, colId);
  }


  getDocRef(colId: string, docId: string) {
    return doc(this.getCollRef(colId), docId);
  }
}
