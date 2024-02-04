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
  constructor(public chatService: MessageService) {}

 

  getChannelUsersLength(){
    if (this.chatService.currentChannel === undefined) {
      return '';
    }
    return this.chatService.currentChannel[0].users.length;
  }

  getUserPic(user: string) {
    // let index = this.chatService.usersTest.user.indexOf(user);
    // return this.chatService.usersTest.picURL[index];
  }

  getCurrentChannel() {
    // return this.chatService.getChannel('NME25IW6lIFNuqfo4IrP');
  }

  async getCurrentChannelProberty() {}
}
