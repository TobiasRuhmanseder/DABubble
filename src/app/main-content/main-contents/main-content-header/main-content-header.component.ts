import { Component } from '@angular/core';
import { MessageService } from '../../../../services/message.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-content-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-content-header.component.html',
  styleUrl: './main-content-header.component.scss',
})
export class MainContentHeaderComponent {
  showBg: boolean = false;
  addUserDialog: boolean = false;
  userDialog: boolean = false;
  constructor(public chatService: MessageService) {}


  closeAllDialog() {
    this.showBg = false;
    this.addUserDialog = false;
    this.userDialog = false;
  }

  addUser() {
    this.showBg = !this.showBg;
    this.addUserDialog = true;
  }

  openUserDialog() {
    this.showBg = !this.showBg;
    this.userDialog = true;
  }

  openChannelData() {
    this.showBg = !this.showBg;
  }

  getChannelUsersLength() {
    if (this.chatService.currentChannel === undefined) {
      return '';
    }
    return this.chatService.currentChannel[0].users.length;
  }

  getUserPic(user: string) {
    // let index = this.chatService.usersTest.user.indexOf(user);
    // return this.chatService.usersTest.picURL[index];
  }
}
