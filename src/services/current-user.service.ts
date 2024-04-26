import { Injectable, OnDestroy, OnInit, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { getAuth, onAuthStateChanged, signOut, updateProfile, updateEmail } from "firebase/auth";
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CurrentUserService implements OnDestroy {
  firestore: Firestore = inject(Firestore);
  router: Router = inject(Router);
  currentUser = new Subject;

  constructor() { }

  ngOnDestroy(): void {
    this.currentUser.unsubscribe();
  }

  async activeUser() {
    const auth = getAuth();
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        this.currentUser.next(this.getDataFromActiveUser(auth));
        // User is signed in.
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
    return user;
  }

  editUserDetails(userName: string, userEmail: string | any) {
    const auth = getAuth();
    if (auth.currentUser) {
      updateProfile(auth.currentUser, {
        displayName: userName
      }).then(() => {
        console.log('Profile updated')
      }).catch((error) => {
        console.log(error.code);
      });
    } 
    if (auth.currentUser) {
      updateEmail(auth.currentUser, userEmail).then(() => {
        console.log('Email updated')
      }).catch((error) => {
        console.log(error.code);
      });
    }
  }
}