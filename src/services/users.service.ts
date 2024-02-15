import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  allUsers: any[] = [];
  allUsersName: any[] = [];
  constructor(private fire: FirebaseService) {}

  async getAllUsers() {
    this.allUsers = [];
    this.allUsers = await this.fire.getUserList();
    console.log('List of all Users:', this.allUsers);
    this.allUsersName = this.getAllUsersName();
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
  getAllUsersName() {
    let list: any[] = [];
    this.allUsers.forEach((user) => {
      list.push(user.name);
    });
    console.log(list);
    return list;
  }
}
