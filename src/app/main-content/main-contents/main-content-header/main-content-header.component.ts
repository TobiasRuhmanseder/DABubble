import { Component } from '@angular/core';
import { MessageService } from '../../../../services/message.service';
import { CommonModule } from '@angular/common';
import { DialogUserInfoComponent } from '../../private-chat/dialog-user-info/dialog-user-info.component';
import { MatDialog } from '@angular/material/dialog';
import { ChannelPopUpComponent } from '../../channel/channel-pop-up/channel-pop-up.component';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { UsersService } from '../../../../services/users.service';

@Component({
  selector: 'app-main-content-header',
  standalone: true,
  imports: [CommonModule, FormsModule, MatMenuModule],
  templateUrl: './main-content-header.component.html',
  styleUrl: './main-content-header.component.scss',
})
export class MainContentHeaderComponent {
  showBg: boolean = false;
  addUserDialog: boolean = false;
  userDialog: boolean = false;
  disableButton: boolean = true;
  inputAddUser: string = '';
  constructor(
    public chatService: MessageService,
    public userDetails: MatDialog,
    public channelDetails: MatDialog,
    public users: UsersService
  ) {}
  filterUserList() {
    let list = this.users.allUsers;
    let filterList = list.filter((user) => {
      return user.name.toLowerCase().includes(this.inputAddUser.toLowerCase());
    });
    return filterList;
  }

  selectUser(user: string) {
    this.inputAddUser = user;
    this.disableButton = false;
  }

  closeUser() {
    this.inputAddUser = '';
    this.disableButton = true;
  }

  // muss noch im firebase gespeichert werden!
  addUserToChannel() {
    this.chatService.currentChannel[0].users.push(this.inputAddUser);
    this.chatService.addUserToChannel(
      this.inputAddUser,
      this.chatService.currentChannel[0].id
    );
  }

  openUserDetails() {
    this.userDetails.open(DialogUserInfoComponent, {});
  }

  closeAllDialog() {
    this.showBg = false;
    this.addUserDialog = false;
    this.userDialog = false;
    this.inputAddUser = '';
    this.disableButton = true;
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
    return this.chatService.currentChannel[0].users.length;
  }

  getUserPicFromChannel(user: string) {
    let checkIfUserInChannel = this.chatService.currentChannel[0].users.find(
      (users: string) => users === user
    );
    if (checkIfUserInChannel) {
      let userPic = this.users.getUserPic(checkIfUserInChannel);
      if (userPic) {
        return userPic.photoURL;
      }
    }
    return 'Profile';
  }
}
