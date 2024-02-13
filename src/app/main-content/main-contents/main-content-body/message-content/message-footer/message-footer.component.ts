import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MessageService } from '../../../../../../services/message.service';
import { UsersService } from '../../../../../../services/users.service';

@Component({
  selector: 'app-message-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-footer.component.html',
  styleUrl: './message-footer.component.scss',
})
export class MessageFooterComponent {
  threadMessages: any;
  constructor(public chatService: MessageService, public users: UsersService) {}
  @Input() flagg: any;

  @Input() msg: any;
  @Input() i: any;
  @Input() mainChat: any;
  @Input() list: any;


  getUserName(userName: string, reaction: string, msg: any) {
    if (userName === this.chatService.eingeloggterUser) {
      if (msg[`reaction${reaction}`].length > 1) {
        return 'und Du';
      }
      return 'Du';
    }
    return this.users.getUserName(userName);
  }

  setSelfToLast(msg: any, reaction: string) {
    let user = this.chatService.eingeloggterUser;
    if (
      msg[`reaction${reaction}`].includes(user) &&
      msg[`reaction${reaction}`] > 1
    ) {
      let index = msg[`reaction${reaction}`].indexOf(user);
      msg[`reaction${reaction}`].splice(index, 1);
      msg[`reaction${reaction}`].push(user);
    }
    return msg[`reaction${reaction}`];
  }

  checkAnswer(i: number) {
    if (this.chatService.threadList[i] != undefined) {
      if (this.chatService.threadList[i].length > 0) {
        return true;
      }
    }
    return false;
  }

  getThreadMessages(i: number) {
    if (this.chatService.threadList[i] != undefined) {
      if (this.chatService.threadList[i].length > 0) {
        return this.chatService.threadList[i].length;
      }
    }
    return '';
  }

  getThreadTimestamp(i: number) {
    if (this.chatService.threadList[i] != undefined) {
      return this.chatService.getMessageTime(
        this.chatService.threadList[i][
          this.chatService.threadList[i].length - 1
        ].timestamp
      );
    }
    return '';
  }
}
