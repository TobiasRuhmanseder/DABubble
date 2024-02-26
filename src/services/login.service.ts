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
  wrongMailOrPassword: string = ''; // Holds an error message for incorrect email or password during login.
  mailInUse: boolean = false; // Error message when the email is already in use during user registration.
  userName: string = ''; // Users display name.
  userImg: string = './../../../assets/img/user_pics/default_user.svg'; // Users profile name.
  customAvatar$ = new Subject(); // Subject to send custom avatar url to component.
  showConfirmationMessage: boolean = false;
  saveAvatarBtnDisabled: boolean = false;
  loadAvatarBtnDisabled: boolean = false;
  invalidImgType: string = '';
  showIntroAnimation = true;
  userObject: User[] = []; // Object to add user data to Firestore.

  /**
   * Reference to the Firestore instance.
   * @type {Firestore}
   */
  firestore: Firestore = inject(Firestore);

  /**
  * Constructs the LoginService.
  * @param {Router} router - Angular Router service.
  */
  constructor(private router: Router) {

  }

  /**
   * Logs in a user with the provided email and password.
   *
   * @param {string} email - User's email.
   * @param {string} password - User's password.
   * @returns {Promise<void>} - Promise representing the login operation.
   */
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

  /**
   * Registers a new user with the provided email and password.
   *
   * @param {string} email - User's email.
   * @param {string} password - User's password.
   * @returns {Promise<void>} - Promise representing the registration operation.
   */
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

  /**
   * Initiates a Google login.
   */
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

  /**
   * Saves additional user details display name and profile image URL.
   */
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

  /**
   * Adds a new user also to Firestore with specified details.
   *
   * @param {any} user - User object containing user information.
   * @param {boolean} statusValue - Login status value of the user.
   * @returns {void}
   */
  addUserToFirestore(user: any, statusValue: boolean) {
    const uid = user.uid;
    const userObject = this.createUserObject(user, statusValue);

    setDoc(doc(this.firestore, 'users', uid), userObject.toJSON())
      .catch((error) => {
        console.error('Error Message', error);
      });
  }

  /**
  * Creates a user object based on the provided user details.
  *
  * @param {any} user - User object containing user information.
  * @param {boolean} statusValue - Login status value of the user.
  * @returns {User} - User object with specified details.
  */
  createUserObject(user: any, statusValue: boolean) {
    const displayName = user.displayName;
    const email = user.email;
    const photoURL = user.photoURL;

    return new User({
      name: displayName,
      email: email,
      photoURL: photoURL,
      status: statusValue,
      directmsg: []
    });
  }

  /**
   * Sends a confirmation email to the currently authenticated user.
   */
  sendConfirmationMail() {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      sendEmailVerification(auth.currentUser)
        .catch((error) => {
          console.log(error.code);
        }
        );
    }
  }

  /**
  * Handles the upload of a user's profile image to storage.
  *
  * @param {any} imgFile - Image file to be uploaded.
  * @param {string} customURL - Custom URL for the image.
  */
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

  /**
  * Uploads an image file to storage and updates the user's profile image URL.
  *
  * @param {any} storageRef - Reference to the storage location.
  * @param {any} imgFile - Image file to be uploaded.
  */
  uploadImageToStorage(storageRef: any, imgFile: any): void {
    uploadBytes(storageRef, imgFile).then(() => {
      getDownloadURL(storageRef).then((imgURL) => {
        this.userImg = imgURL;
        this.customAvatar$.next(imgURL);
      });
    });
  }

  /**
   * Handles the case where an invalid image type is selected during avatar upload and shows an error message.
   */
  handleInvalidImageType() {
    this.invalidImgType = 'Erlaubte Dateiformate: PNG, JPEG und GIF. Bitte wähle eine gültige Datei aus.';
    this.loadAvatarBtnDisabled = false;
  }

  /**
   * Initiates the process of resetting a user's password.
   *
   * @param {string} email - User's email for password reset.
   * @returns {Promise<void>} - Promise representing the password reset operation.
   */
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

  /**
  * Navigates the user back to the login page after a delay of 4000ms.
  */
  backToLogin() {
    setTimeout(() => {
      this.showConfirmationMessage = false;
      this.saveAvatarBtnDisabled = false;
      this.router.navigate(['']);
    }, 4000);
  }
}


