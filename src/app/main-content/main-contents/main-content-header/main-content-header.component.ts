import { Component } from '@angular/core';
import { MessageService } from '../../../../services/message.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-content-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-content-header.component.html',
  styleUrl: './main-content-header.component.scss'
})
export class MainContentHeaderComponent {
  constructor(public chatService: MessageService) {}

  getUserPic(user: string) {
    let index = this.chatService.usersTest.user.indexOf(user);
    return this.chatService.usersTest.picURL[index];
  }
}
