import { Injectable, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  wrongMailOrPassword: string = '';
  mailInUse: string = '';
  userName: string = '';
  userImg: string = '';
  showConfirmationMessage: boolean = false;


  firestore: Firestore = inject(Firestore);

  constructor(private router: Router) {

  }

  // google login
  signInWithGoogle() {
    const provider = new GoogleAuthProvider();

    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const user = result.user;
        console.log('button works', user);
        this.router.navigate(['/home']);
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('Sign In With Google Errors', errorCode, errorMessage)
      });
  }

  // login user
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

  // sign in user
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
        this.showConfirmationMessage = true;
        this.sendConfirmationMail();
        this.backToLogin();
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
        }).catch((error) => {
          console.log(error.code);
        }
        );
    }
  }

  // reset password
  resetPassword(email: string) {
    const auth = getAuth();
    return sendPasswordResetEmail(auth, email)
      .then(() => {
        this.showConfirmationMessage = true;
        this.backToLogin();
      })
      .catch((error) => {
        console.log(error.code);
      });
  }

  // back to login
  backToLogin() {
    setTimeout(() => {
      this.showConfirmationMessage = false;
      this.router.navigate(['']);
    }, 4000);
  }

}


