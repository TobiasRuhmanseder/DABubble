import { Injectable, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { collectionGroup } from 'firebase/firestore';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CurrentUserService {
  firestore: Firestore = inject(Firestore);
  router: Router = inject(Router);
  currentUser = new Subject;

  constructor() { }

  activeUser() {
    const auth = getAuth();
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        this.currentUser.next(this.getDataFromActiveUser(auth));
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
      this.router.navigateByUrl('');
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });
  }

  getDataFromActiveUser(obj: any) {
    const auth = obj;
    const user = auth.currentUser;
    if (user !== null) {
      const displayName = user.displayName;
      const email = user.email;
      const photoURL = user.photoURL;
      const emailVerified = user.emailVerified;
      const uid = user.uid;
    }
    console.log(user); 
    return user;
  }


}