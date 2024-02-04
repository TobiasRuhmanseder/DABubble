import { Injectable, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

@Injectable({
  providedIn: 'root'
})

export class CurrentUserService {
  firestore: Firestore = inject(Firestore);

  constructor() { }

  activeUser() {
    const auth = getAuth();
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in.
        console.log('User', user.displayName, 'is signed in with the ID', user.uid);
      } else {
        // No user is signed in.
      }
    });
  }

  signOut() {
    const auth = getAuth();
    signOut(auth).then(() => {
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });
  }

}
