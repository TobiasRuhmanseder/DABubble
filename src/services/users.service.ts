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
  allUsersName: any[] = [];

  constructor(private fire: FirebaseService) {
    this.unsubUsers = this.subUsers(); // Tobias
  }

  async getAllUsers(): Promise<any[]> {
    try {
      this.allUsers = await this.fire.getUserList();
      console.log('List of all Users:', this.allUsers);
      this.allUsersName = await this.getAllUsersName();
      return this.allUsers;
    } catch (error) {
      throw error;
    }
  }

  getUserFromId(userId: string) {
    return this.allUsers.find((u) => u.id === userId);
  }
  getUserName(userId: string) {
    let user = this.allUsers.find((u) => u.id === userId);
    if (user) {
      return user.name;
    }
    return '';
  }
  getAllUsersName(): Promise<string[]> {
    return new Promise((resolve) => {
      if (this.allUsers) {
        const names = this.allUsers.map((user: any) => user.name);
        resolve(names);
      }
    });
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

  getCollRef(colId: string) {
    return collection(this.firestore, colId);
  }


}





