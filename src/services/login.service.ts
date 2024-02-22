import { Injectable, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { doc, setDoc } from "firebase/firestore";
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
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { Subject } from 'rxjs';
import { User } from '../models/user.class';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  wrongMailOrPassword: string = '';
  mailInUse: boolean = false;
  userName: string = '';
  userImg: string = './../../../assets/img/user_pics/default_user.svg';
  customAvatar$ = new Subject();
  showConfirmationMessage: boolean = false;
  saveAvatarBtnDisabled: boolean = false;
  loadAvatarBtnDisabled: boolean = false;
  invalidImgType: string = '';
  showIntroAnimation = true;
  userObject: User[] = [];

  firestore: Firestore = inject(Firestore);

  constructor(private router: Router) {

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
        this.router.navigate(['/choose-avatar']);
      })
      .catch((error) => {
        console.log(error.code);
        if (error.code == 'auth/email-already-in-use') {
          this.mailInUse = true;
        }
      });
  }

  // google login
  signInWithGoogle() {
    const provider = new GoogleAuthProvider();

    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const user = result.user;
        const statusValue: boolean = true;
        this.addUserToFirestore(user, statusValue);
        this.router.navigate(['/home']);
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('Sign In With Google Errors', errorCode, errorMessage)
      });
  }

  // save additional user details
  saveUserDetails() {
    this.saveAvatarBtnDisabled = true;
    const auth = getAuth();
    const user = auth.currentUser;
    const statusValue: boolean = false;

    if (user) {
      updateProfile(auth.currentUser, {
        displayName: this.userName, photoURL: this.userImg
      }).then(() => {
        this.addUserToFirestore(auth.currentUser, statusValue);
        this.showConfirmationMessage = true;
        this.sendConfirmationMail();
        this.backToLogin();
      }).catch((error) => {
        this.saveAvatarBtnDisabled = false;
        console.log(error.code);
      });
    }
  }

  // add user also to firestore
  addUserToFirestore(user: any, statusValue: boolean) {
    const uid = user.uid;
    const displayName = user.displayName;
    const email = user.email;
    const photoURL = user.photoURL;

    const userObject = new User({
      name: displayName,
      email: email,
      photoURL: photoURL,
      status: statusValue,
      directmsg: []
    });

    setDoc(doc(this.firestore, 'users', uid), userObject.toJSON())
      .then(() => {
        console.log('Benutzer wurde erfolgreich zu Firestore hinzugefügt');
      })
      .catch((error) => {
        console.error('Error Message', error);
      });

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

  // upload avatar
  handleProfileImageUpload(imgFile: any, customURL: string) {
    this.invalidImgType = '';
    const storage = getStorage();
    const storageRef = ref(storage, 'user_pics/' + customURL);

    if (imgFile.type == 'image/png' || imgFile.type == 'image/jpeg' || imgFile.type == 'image/gif') {
      this.uploadImageToStorage(storageRef, imgFile);
    } else {
      this.handleInvalidImageType();
    };
  }

  uploadImageToStorage(storageRef: any, imgFile: any): void {
    uploadBytes(storageRef, imgFile).then(() => {
      getDownloadURL(storageRef).then((imgURL) => {
        this.userImg = imgURL;
        this.customAvatar$.next(imgURL);
      });
    });
  }

  handleInvalidImageType() {
    this.invalidImgType = 'Erlaubte Dateiformate: PNG, JPEG und GIF. Bitte wähle eine gültige Datei aus.';
    this.loadAvatarBtnDisabled = false;
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
      this.saveAvatarBtnDisabled = false;
      this.router.navigate(['']);
    }, 4000);
  }

}


