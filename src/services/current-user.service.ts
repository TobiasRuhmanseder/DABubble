import { Injectable, OnDestroy, OnInit, inject } from '@angular/core';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { getAuth, onAuthStateChanged, signOut, updateProfile, updateEmail, sendEmailVerification } from "firebase/auth";
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
      const currentUser = auth.currentUser;

      updateDoc(doc(this.firestore, 'users', currentUser.uid), {
        name: userName,
        email: userEmail
      }).catch((error) => {
        console.log(error.code);
      });

      updateProfile(currentUser, {
        displayName: userName
      }).catch((error) => {
        console.log(error.code);
      });

      updateEmail(currentUser, userEmail).then(() => {
        this.currentUser.next(currentUser);
        this.sendConfirmationMail(currentUser);
      }).catch((error) => {
        console.log(error.code);
      });
    }
  }

  sendConfirmationMail(currentUser: any) {
    const auth = getAuth();
    sendEmailVerification(currentUser)
      .then(() => {
        console.log('Mail sent');
      }).catch((error) => {
        console.log(error.code);
      });

  }
}