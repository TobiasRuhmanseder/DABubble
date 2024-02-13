import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  allUsers: any[] = [];

  constructor(private fire: FirebaseService) {}

  async getAllUsers() {
    this.allUsers = [];
    this.allUsers = await this.fire.getUserList();
    console.log('List of all Users:', this.allUsers);
  }

  getUserFromId(userId: string) {
    return this.allUsers.find((u) => u.id === userId);
  }
  getUserName(userId: string){
    let user = this.allUsers.find((u) => u.id === userId);
    if (user){
    return user.name;
  }return '';
}
}
