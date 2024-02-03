import { Component } from '@angular/core';
import { MessageService } from '../../../../services/message.service';
import { CommonModule } from '@angular/common';
import { FirebaseServiceService } from '../../../../services/firebase-service.service';

@Component({
  selector: 'app-main-content-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-content-header.component.html',
  styleUrl: './main-content-header.component.scss',
})
export class MainContentHeaderComponent {
  constructor(
    public chatService: MessageService,
    public fire: FirebaseServiceService
  ) {

  }

  getUserPic(user: string) {
    let index = this.chatService.usersTest.user.indexOf(user);
    return this.chatService.usersTest.picURL[index];
  }

  getCurrentChannel() {
    return this.chatService.getChannel('NME25IW6lIFNuqfo4IrP');
  }

  async getCurrentChannelProberty() {}
}
