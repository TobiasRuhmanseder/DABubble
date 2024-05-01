import { Component, inject } from '@angular/core';
import { MessageService } from '../../../../services/message.service';
import { CommonModule } from '@angular/common';
import { DialogUserInfoComponent } from '../../private-chat/dialog-user-info/dialog-user-info.component';
import { MatDialog } from '@angular/material/dialog';
import { ChannelPopUpComponent } from '../../channel/channel-pop-up/channel-pop-up.component';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { UsersService } from '../../../../services/users.service';
import { UserPicComponent } from '../../../user-pic/user-pic.component';
import { FirebaseService } from '../../../../services/firebase.service';
import { Router } from '@angular/router';
import { DirectMessagesService } from '../../../../services/direct-messages.service';

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
  addUserList: any[] = [];
  selectedUser: any[] = [];
  searchInput: string = '';
  searching: any[] = [];
  allChannels: any[] = [];
  router: Router = inject(Router);
  diMeService: DirectMessagesService = inject(DirectMessagesService);
  constructor(
    public chatService: MessageService,
    public dialog: MatDialog,
    public channelDetails: MatDialog,
    public users: UsersService,
    public fire: FirebaseService
  ) {
    this.getAllChannels();
  }

  async getAllChannels() {
    this.allChannels = await this.fire.getAllChannels();
    this.searching = this.allChannels;
  }

  async chooseId(userUid: string) {
    if (userUid != undefined) {
      let directMessageDocId =
        await this.diMeService.getDocIdFromTheDirectMessaging(userUid);
      this.router.navigateByUrl('/home/' + directMessageDocId);
    }
  }

  chooseChannel(id: string) {
    this.router.navigateByUrl('/home/' + id);
  }

  async search() {
    if (this.searchInput.includes('#')) {
      this.searching = this.allChannels;
      const filteredChannels = this.searching.filter((channel) =>
        channel.name
          .toLowerCase()
          .includes(this.searchInput.toLowerCase().replace('#', ''))
      );
      this.searching = filteredChannels;
      return;
    }
    if (this.searchInput.includes('@')) {
      this.searching = this.users.allUsers;
      const filteredUsers = this.searching.filter(
        (user) =>
          user.name
            .toLowerCase()
            .includes(this.searchInput.toLowerCase().replace('@', '')) ||
          user.email
            .toLowerCase()
            .includes(this.searchInput.toLowerCase().replace('@', ''))
      );
      this.searching = filteredUsers;
      return;
    }
    this.searching = [];
  }

  filterUserList() {
    let allUserList = this.users.users;
    let list = allUserList.filter((user: { id: any }) => {
      return !this.chatService.currentChannel.users.includes(user.id);
    });
    let filterList = list.filter((user: { name: string }) => {
      return user.name.toLowerCase().includes(this.inputAddUser.toLowerCase());
    });
    this.addUserList = filterList;
  }

  selectUser(user: any) {
    this.selectedUser.push(user);
    let index = this.addUserList.indexOf(user);
    if (index > -1) {
      this.addUserList.splice(index, 1);
    }
    this.inputAddUser = '';
  }

  closeUserDialog() {
    this.inputAddUser = '';
    this.selectedUser = [];
  }

  closeUser(user: any) {
    let index = this.selectedUser.indexOf(user);
    if (index > -1) {
      this.selectedUser.splice(index, 1);
    }
    this.addUserList.push(user);
  }

  addUserToChannel() {
    for (let i = 0; i < this.selectedUser.length; i++) {
      this.users.users.find((user: any) => {
        if (user === this.selectedUser[i]) {
          this.chatService.currentChannel.users.push(user.id);
        }
      });
    }
    this.chatService.saveChannel();
    this.closeUserDialog();
    this.closeAllDialog();
  }

  openUserDetails(id: string) {
    this.dialog.open(DialogUserInfoComponent, {
      data: { id: id },
    });
  }

  closeAllDialog() {
    this.showBg = false;
    this.addUserDialog = false;
    this.userDialog = false;
    this.inputAddUser = '';
    this.selectedUser = [];
  }

  addUser() {
    if (this.chatService.currentChannel.users.length != 0) {
      this.showBg = !this.showBg;
      this.addUserDialog = true;
      this.filterUserList();
    }
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
    this.channelDetails.open(ChannelPopUpComponent, {
      data: { channel: this.chatService.currentChannel },
    });
  }

  getChannelUsersLength() {
    if (this.chatService.currentChannel === undefined) {
      return '';
    }
    if (this.chatService.currentChannel.users.length === 0) {
      return this.users.allUsers.length;
    }
    return JSON.parse(this.chatService.currentChannel.users).length;
  }

  getChannelUsers() {
    if (this.chatService.currentChannel === undefined) {
      return '';
    }
    
    if (this.chatService.currentChannel.users.length === 0) {
      return this.allUsersId();
    }
    return JSON.parse(this.chatService.currentChannel.users);
  }

  allUsersId() {
    let allUsersId = [];
    for (let index = 0; index < this.users.allUsers.length; index++) {
      allUsersId.push(this.users.allUsers[index].id);
    }
    return allUsersId;
  }

  getUserPicFromChannel(user: string) {
    let checkIfUserInChannel;
    let userList;
    if (this.chatService.currentChannel.users.length === 0) {
      userList = this.allUsersId();
    } else {
      userList = JSON.parse(this.chatService.currentChannel.users);
    }
    checkIfUserInChannel = userList.find((users: string) => users === user);
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
    try {
      return currentUser.status;
    } catch (e) {
      console.log('Dont found Email with ID:', userId);
    }
  }

  getDirectMessageUser() {
    let directUserId = this.chatService.currentChannel.users.filter(
      (user: any) => user !== this.chatService.currentUser
    );
    if (
      directUserId.length === 0 &&
      this.chatService.currentChannel.users.length === 2
    ) {
      directUserId.push(this.chatService.currentChannel.users[0]);
    }
    let directUser = this.users.getUserFromId(directUserId[0]);
    if (!directUser) {
      return 'User not found';
    }
    return directUser;
  }

  getDirectUserName() {
    let user = this.getDirectMessageUser();
    if (user.id === this.chatService.currentUser) {
      return user.name + ' (Du)';
    }
    return user.name;
  }
}
