import { Injectable, OnDestroy, OnInit, inject } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Firestore } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { onSnapshot } from '@angular/fire/firestore';
import { collection } from '@firebase/firestore';
import { User } from '../models/user.class';

@Injectable({
  providedIn: 'root',
})
export class UsersService implements OnDestroy {
  allUsers: any[] = [];

  constructor(private fire: FirebaseService) {
    this.unsubUsers = this.subUsers();
  }

  /**
 * Retrieves a list of all users from the Firebase database.
 * @returns That resolves an array of user objects.
 * @throws {Error} If there is an error retrieving the user list from Firebase.
 */
  async getAllUsers(): Promise<any[]> {
    try {
      this.allUsers = await this.fire.getUserList();
      console.log('List of all Users:', this.allUsers);
      return this.allUsers;
    } catch (error) {
      throw error;
    }
  }

  /**
 * Retrieves a user object from the allUsers array based on the provided userId.
 * @param {string} userId - The unique identifier of the user to retrieve.
 * @returns The user object with the matching userId, or undefined if not found.
 */
  getUserFromId(userId: string) {
    return this.allUsers.find((u) => u.id === userId);
  }

  /**
 * Retrieves the username for a given user ID.
 * @param {string} userId - The ID of the user whose username is to be retrieved.
 * @returns {string} The username of the user, or 'User dont found' if the user is not found.
 */
  getUserName(userId: string) {
    let user = this.allUsers.find((u) => u.id === userId);
    if (user) {
      return user.name;
    }
    return 'User dont found'
  }

  /**
 * Retrieves the user's profile picture URL based on the provided user ID.
 * @param {any} userId - The ID of the user whose profile picture is to be retrieved.
 * @returns {string} The URL of the user's profile picture, or a default image URL if the user is not found.
 */
  getUserPic(userId: any) {
    let user = this.getUserFromId(userId);
    if (user) {
      return user.photoURL;
    }
    return './assets/img/user_pics/default_user.svg';
  }


  ///Tobias 


  users: any = [];
  users$: any = new Subject;
  firestore: Firestore = inject(Firestore);

  unsubUsers;


  ngOnDestroy(): void {
    console.log('users.service destroy');
    this.unsubUsers();
  }

  /**
   * 
   * @returns returns a firebase snapshot on the collection users
   */
  subUsers() {
    return onSnapshot(this.getCollRef('users'), (list) => {
      this.users = [];
      list.forEach((element) => {
        let user = new User(element.data(), element.id)
        this.users.push(user);
      });
      this.users$.next(this.users);
    });

  }

  /**
   * 
   * @param colId collection id
   * @returns returns the firebase collection path
   */
  getCollRef(colId: string) {
    return collection(this.firestore, colId);
  }


}





