import { Injectable, OnDestroy, OnInit, inject } from '@angular/core';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { getAuth, onAuthStateChanged, signOut, updateProfile, updateEmail } from "firebase/auth";
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CurrentUserService implements OnDestroy {
  firestore: Firestore = inject(Firestore);
  router: Router = inject(Router);
  currentUser = new BehaviorSubject<any>(null);

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
      const currentEmail = currentUser.email;

      this.updateFirestoreUserDetails(currentUser, userName, userEmail);
      this.updateUserProfile(currentUser, userName);

      if (currentEmail !== userEmail) {
        this.handleEmailUpdate(currentUser, userEmail);
      }
    }
  }

  updateFirestoreUserDetails(currentUser: any, userName: string, userEmail: string) {
    updateDoc(doc(this.firestore, 'users', currentUser.uid), {
      name: userName,
      email: userEmail
    }).catch((error) => {
      console.log(error.code);
    });
  }

  updateUserProfile(currentUser: any, userName: string) {
    updateProfile(currentUser, {
      displayName: userName
    }).then(() => {
      this.currentUser.next(currentUser);
    }).catch((error) => {
      console.log(error.code);
    });
  }

  handleEmailUpdate(currentUser: any, userEmail: string) {
    updateEmail(currentUser, userEmail).then(() => {
      this.currentUser.next(currentUser);
      this.sendConfirmationMail(currentUser);
    }).catch((error) => {
      console.log(error.code);
    });
  }

  sendConfirmationMail(currentUser: any) {
    const auth = getAuth();
    sendEmailVerification(currentUser).catch((error) => {
      console.log(error.code);
    });

  }
}