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

  /**
   * Retrieves all channels asynchronously and stores them in the `allChannels` and `searching` properties.
   * @returns {Promise<void>} A Promise that resolves when all channels have been retrieved and stored.
   */
  async getAllChannels() {
    this.allChannels = await this.fire.getAllChannels();
    this.searching = this.allChannels;
  }

  /**
   * Chooses the document ID for direct messaging and navigates to the corresponding route.
   * @param {string} userUid - The unique identifier of the user.
   * @returns {Promise<void>} A Promise that resolves when the navigation is complete.
   */
  async chooseId(userUid: string) {
    if (userUid != undefined) {
      let directMessageDocId =
        await this.diMeService.getDocIdFromTheDirectMessaging(userUid);
      this.router.navigateByUrl('/home/' + directMessageDocId);
    }
  }

  /**
   * Navigates to the specified channel by its ID.
   * @param {string} id - The ID of the channel to navigate to.
   * @returns {void}
   */
  chooseChannel(id: string) {
    this.router.navigateByUrl('/home/' + id);
  }

  /**
   * Performs a search based on the user's input.
   * If the input contains a '#', it searches for a channel.
   * If the input contains an '@', it searches for a user.
   * Otherwise, it clears the searching array.
   * @returns {Promise<void>} A Promise that resolves when the search is complete.
   */
  async search() {
    if (this.searchInput.includes('#')) {
      return this.searchChannel();
    }
    if (this.searchInput.includes('@')) {
      return this.searchUser();
    }
    this.searching = [];
  }

  /**
   * Searches for users based on the search input.
   * @returns {void}
   */
  private searchUser() {
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

  /**
   * Searches for channels based on the user's input in the search field.
   * @returns {void}
   */
  private searchChannel() {
    this.searching = this.allChannels;
    const filteredChannels = this.searching.filter((channel) =>
      channel.name
        .toLowerCase()
        .includes(this.searchInput.toLowerCase().replace('#', ''))
    );
    this.searching = filteredChannels;
    return;
  }

  /**
   * Filters the user list based on the current user's role and permissions.
   */
  filterUserList() {
    this.setCurrentUser();
    let allUserList = this.users.users;
    let list = this.filterAllUser(allUserList);
    list = this.filterSelectedUser(list);
    list = this.filterInput(list);
    this.addUserList = list;
  }

  /**
   * Filters a list of objects based on the user's input.
   * @param {any[]} list - The list of objects to filter.
   * @returns {Object[]} The filtered list of objects.
   */
  private filterInput(list: any) {
    return list.filter((user: { name: string }) => {
      return user.name.toLowerCase().includes(this.inputAddUser.toLowerCase());
    });
  }

  /**
   * Filters out users from the provided list that are already present in the selectedUser array.
   * @param {any[]} list - The list of users to be filtered.
   * @returns {any[]} The filtered list of users.
   */
  private filterSelectedUser(list: any) {
    list = list.filter((user: { id: any }) => {
      return !this.selectedUser.some(
        (selectedUser) => selectedUser.id === user.id
      );
    });
    return list;
  }

  /**
   * Filters the list of all users to exclude users that are already part of the current channel.
   * @param {any[]} allUserList - The list of all users.
   * @returns {any[]} The filtered list of users that are not part of the current channel.
   */
  private filterAllUser(allUserList: any) {
    return allUserList.filter((user: { id: any }) => {
      return !this.chatService.currentChannel.users.includes(user.id);
    });
  }

  /**
   * Selects a user from the list of available users and adds it to the selected users list.
   * The selected user is removed from the list of available users.
   * @param {any} user - The user object to be selected.
   */
  selectUser(user: any) {
    this.selectedUser.push(user);
    let index = this.addUserList.indexOf(user);
    if (index > -1) {
      this.addUserList.splice(index, 1);
    }
    this.inputAddUser = '';
  }

  /**
   * Resets the input field for adding a new user and clears the selected user.
   */
  closeUserDialog() {
    this.inputAddUser = '';
    this.selectedUser = [];
  }

  /**
   * Removes a user from the selectedUser array and adds it to the addUserList array.
   * @param {any} user - The user object to be removed from the selectedUser array.
   */
  closeUser(user: any) {
    let index = this.selectedUser.indexOf(user);
    if (index > -1) {
      this.selectedUser.splice(index, 1);
    }
    this.addUserList.push(user);
  }

  /**
   * Adds the selected users to the current channel.
   * @method addUserToChannel
   * @returns {void}
   */
  addUserToChannel() {
    for (let i = 0; i < this.selectedUser.length; i++) {
      this.users.users.find((user: any) => {
        if (user.id === this.selectedUser[i].id) {
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

  /**
   * Closes all open dialogs and resets related properties.
   */
  closeAllDialog() {
    this.showBg = false;
    this.addUserDialog = false;
    this.userDialog = false;
    this.inputAddUser = '';
    this.selectedUser = [];
  }

  /**
   * Adds a new user to the current channel.
   */
  addUser() {
    this.setCurrentUser();
    if (this.chatService.currentChannel.users.length != 0) {
      this.showBg = !this.showBg;
      this.addUserDialog = true;
      this.filterUserList();
    }
  }

  /**
   * Sets the current user for the chat service.
   */
  private setCurrentUser() {
    try {
      this.chatService.currentChannel.users = JSON.parse(
        this.chatService.currentChannel.users
      );
    } catch {}
  }

  /**
   * Navigates to the "Add User" dialog by closing the current user dialog and opening the "Add User" dialog.
   */
  goToAddUser() {
    this.userDialog = false;
    this.addUserDialog = true;
  }

  openUserDialog() {
    this.showBg = !this.showBg;
    this.userDialog = true;
  }

  openChannelData() {
    this.setCurrentUser();
    this.channelDetails.open(ChannelPopUpComponent, {
      data: { channel: this.chatService.currentChannel },
    });
  }

  /**
   * Retrieves the number of users in the current channel.
   */
  getChannelUsersLength() {
    this.setCurrentUser();
    if (this.chatService.currentChannel === undefined) {
      return '';
    }
    if (this.chatService.currentChannel.users.length === 0) {
      return this.users.allUsers.length;
    }
    try {
      return this.chatService.currentChannel.users.length;
    } catch {}
  }

  /**
   * Retrieves the list of users in the current channel.
   * @returns {string|Array} If the current channel is undefined, returns an empty string.
   *                         If the current channel has no users, returns an array of all user IDs.
   *                         Otherwise, returns an array of user IDs in the current channel.
   */
  getChannelUsers() {
    this.setCurrentUser();
    if (this.chatService.currentChannel === undefined) {
      return '';
    }

    if (this.chatService.currentChannel.users.length === 0) {
      return this.allUsersId();
    }
    return this.chatService.currentChannel.users;
  }

  /**
   * Retrieves an array of all user IDs from the allUsers array.
   * @returns {number[]} An array containing the IDs of all users.
   */
  allUsersId() {
    let allUsersId = [];
    for (let index = 0; index < this.users.allUsers.length; index++) {
      allUsersId.push(this.users.allUsers[index].id);
    }
    return allUsersId;
  }

  /**
   * Retrieves the profile picture URL of a user from the current channel or all users.
   * @param {string} user - The ID of the user whose profile picture is requested.
   * @returns {string} The URL of the user's profile picture, or a default image if not found.
   */
  getUserPicFromChannel(user: string) {
    this.setCurrentUser();
    let checkIfUserInChannel;
    let userList;
    if (this.chatService.currentChannel.users.length === 0) {
      userList = this.allUsersId();
    } else {
      userList = this.chatService.currentChannel.users;
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

  /**
   * Retrieves the status of a user based on their user ID.
   * @param {string} userId - The unique identifier of the user.
   * @returns {string|undefined} The status of the user, or undefined if the user is not found.
   */
  getUserStatus(userId: string) {
    let currentUser = this.users.getUserFromId(userId);
    try {
      return currentUser.status;
    } catch (e) {
      console.log('Dont found Email with ID:', userId);
    }
  }

  /**
   * Retrieves the direct message user from the current channel.
   * @returns {string|User} Returns the direct message user object or 'User not found' if the user is not found.
   */
  getDirectMessageUser() {
    this.setCurrentUser();
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

  /**
   * Returns the name of the user in a direct message conversation.
   * If the user is the current user, it appends " (You)" to the name.
   * @returns {string} The name of the user, with " (You)" appended if it's the current user.
   */
  getDirectUserName() {
    let user = this.getDirectMessageUser();
    if (user.id === this.chatService.currentUser) {
      return user.name + ' (Du)';
    }
    return user.name;
  }
}
