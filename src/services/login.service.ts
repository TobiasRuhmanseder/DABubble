import { Injectable, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  wrongMailOrPassword: string = '';
  mailInUse: string = '';
  firestore: Firestore = inject(Firestore);

  constructor(private router: Router) { }

  login(email: string, password: string) {
    const auth = getAuth();
    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log('logged in: ', user);
        // ...
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
        // Signed up 
        const user = userCredential.user;
        console.log('signed in: ', user);
        // ...
      })
      .catch((error) => {
        console.log(error.code);
        if (error.code == 'auth/email-already-in-use') {
          this.mailInUse = 'Diese Emailadresse ist bereits vergeben.';
        }
      });
  }

}
