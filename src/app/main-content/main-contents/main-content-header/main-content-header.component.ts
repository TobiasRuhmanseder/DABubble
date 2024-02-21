import { Component } from '@angular/core';
import { MessageService } from '../../../../services/message.service';
import { CommonModule } from '@angular/common';
import { DialogUserInfoComponent } from '../../private-chat/dialog-user-info/dialog-user-info.component';
import { MatDialog } from '@angular/material/dialog';
import { ChannelPopUpComponent } from '../../channel/channel-pop-up/channel-pop-up.component';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { UsersService } from '../../../../services/users.service';
import { UserPicComponent } from '../../../user-pic/user-pic.component';

@Component({
  selector: 'app-main-content-header',
  standalone: true,
  templateUrl: './main-content-header.component.html',
  styleUrl: './main-content-header.component.scss',
  imports: [CommonModule, FormsModule, MatMenuModule, UserPicComponent],
})
export class MainContentHeaderComponent {
  showBg: boolean = false;
  addUserDialog: boolean = false;
  userDialog: boolean = false;
  inputAddUser: string = '';
  selectedUser: any;
  addSelectUser: boolean = false;
  constructor(
    public chatService: MessageService,
    public userDetails: MatDialog,
    public channelDetails: MatDialog,
    public users: UsersService
  ) {}
  filterUserList() {
    let allUserList = this.users.users;
    let list = allUserList.filter((user: { id: any }) => {
      return !this.chatService.currentChannel.users.includes(user.id);
    });
    let filterList = list.filter((user: { name: string }) => {
      return user.name.toLowerCase().includes(this.inputAddUser.toLowerCase());
    });
    return filterList;
  }
  checkUserExists() {
    if (!this.addSelectUser) {
      return !this.users.users.some(
        (user: { name: string }) =>
          user.name.toLowerCase() === this.inputAddUser.toLowerCase()
      );
    }
    return false;
  }

  selectUser(user: any) {
    this.selectedUser = user;
    this.inputAddUser = user.name;
    this.addSelectUser = true;
  }

  closeUser() {
    this.inputAddUser = '';
    this.selectedUser = [];
    this.addSelectUser = false;
  }

  addUserToChannel() {
    let user = this.users.users.find((user: { name: string }) => {
      return user.name.toLowerCase() === this.inputAddUser.toLowerCase();
    });
    this.chatService.currentChannel.users.push(user.id);
    this.chatService.saveChannel();
    this.closeUser();
  }

  openUserDetails() {
    this.userDetails.open(DialogUserInfoComponent, {});
  }

  closeAllDialog() {
    this.showBg = false;
    this.addUserDialog = false;
    this.userDialog = false;
    this.inputAddUser = '';
    this.addSelectUser = false;
    this.selectedUser = [];
  }

  addUser() {
    this.showBg = !this.showBg;
    this.addUserDialog = true;
  }

  goToAddUser() {
    this.userDialog = false;
    this.addUserDialog = true;
  }

  openUserDialog() {
    this.showBg = !this.showBg;
    this.userDialog = true;
  }

  openChannelData() {
    this.channelDetails.open(ChannelPopUpComponent, {});
  }

  getChannelUsersLength() {
    if (this.chatService.currentChannel === undefined) {
      return '';
    }
    return this.chatService.currentChannel.users.length;
  }

  getUserPicFromChannel(user: string) {
    let checkIfUserInChannel = this.chatService.currentChannel.users.find(
      (users: string) => users === user
    );
    if (checkIfUserInChannel) {
      let userPic = this.users.getUserFromId(checkIfUserInChannel);
      if (userPic) {
        return userPic.photoURL;
      }
    }
    return './assets/img/user_pics/default_user.svg';
  }
  getUserStatus(userId: string) {
    let currentUser = this.users.getUserFromId(userId);

    let user = this.users.users.find(
      (u: { email: string }) => u.email === currentUser.email
    );
    return user.status;
  }
}
