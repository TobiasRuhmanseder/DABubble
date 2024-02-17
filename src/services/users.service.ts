import { Injectable, OnInit } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  allUsers: any[] = [];
  allUsersName: any[] = [];

  allUsers$: any = new Subject;

  constructor(private fire: FirebaseService) { }

  async getAllUsers(): Promise<any[]> {
    try {
      this.allUsers = await this.fire.getUserList();
      console.log('List of all Users:', this.allUsers);
      this.allUsersName = await this.getAllUsersName();
      this.allUsers$.next(this.allUsers);
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
}
