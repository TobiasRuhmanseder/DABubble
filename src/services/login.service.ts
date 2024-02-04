import { Injectable, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  wrongMailOrPassword: string = '';
  mailInUse: string = '';
  userName: string = '';
  userImg: string = '';

  firestore: Firestore = inject(Firestore);

  constructor(private router: Router) { }

  login(email: string, password: string) {
    const auth = getAuth();
    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        console.log(error.code);
        if (error.code == 'auth/invalid-credential') {
          this.wrongMailOrPassword = 'Falsche E-Mail oder falsches Passwort.';
        }
      });
  }

  signIn(email: string, password: string) {
    const auth = getAuth();
    return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('Signed in: ', user);
      })
      .catch((error) => {
        console.log(error.code);
        if (error.code == 'auth/email-already-in-use') {
          this.mailInUse = 'Diese Emailadresse ist bereits vergeben.';
        }
      });
  }


  saveUserDetails() {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      updateProfile(auth.currentUser, {
        displayName: this.userName, photoURL: this.userImg
      }).then(() => {
        console.log('Profile updatet: ', auth.currentUser);
        this.sendConfirmationMail();
      }).catch((error) => {
        console.log(error.code);
      });
    } else {
      console.log('No user signed in');
    }
  }

  sendConfirmationMail() {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (user) {
      sendEmailVerification(auth.currentUser)
        .then(() => {
          console.log('Email verification sent!');
        });
    }
  }
}
