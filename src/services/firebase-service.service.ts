import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirebaseServiceService {
  firestore: Firestore = inject(Firestore);

  constructor() {}

  getMsgRef() {
    const messageRef = doc(
      this.firestore,
      'channels',
      'kShBVOfrw9cz8gkKWjOq',
      'messages'
    );
  }

  getDocsRef(colId: string) {
    return getDocs(this.getCollRef(colId));
  }

  getDocSnap(colId: string, docId: string) {
    const docRef = doc(this.firestore, colId, docId);
    const docSnap = getDoc(docRef);
    return docSnap;
  }

  getCollRef(colId: string) {
    return collection(this.firestore, colId);
  }

  getDocRef(colId: string, docId: string) {
    return doc(this.getCollRef(colId), docId);
  }
}
