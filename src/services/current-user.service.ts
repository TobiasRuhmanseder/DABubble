import { Injectable, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CurrentUserService {
  firestore: Firestore = inject(Firestore);
  currentUser = new Subject;

  constructor() { }

  activeUser() {
    const auth = getAuth();
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        this.currentUser.next(this.getDataFromActiveUser());
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

  getDataFromActiveUser() {
    const auth = getAuth();
    console.log(auth);
    const user = auth.currentUser;
    console.log(user);
    if (user !== null) {
      const displayName = user.displayName;
      const email = user.email;
      const photoURL = user.photoURL;
      const emailVerified = user.emailVerified;
      const uid = user.uid;
    }
    return user;
  }


}