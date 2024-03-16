import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MessageContentComponent } from './message-content/message-content.component';
import { UsersService } from '../../../../services/users.service';
import { MessageService } from '../../../../services/message.service';
import { UserPicComponent } from '../../../user-pic/user-pic.component';
import { Channel } from '../../../../models/channel.class';
import { MatDialog } from '@angular/material/dialog';
import { DialogUserInfoComponent } from '../../private-chat/dialog-user-info/dialog-user-info.component';
import { ChannelPopUpComponent } from '../../channel/channel-pop-up/channel-pop-up.component';

@Component({
  selector: 'app-main-content-body',
  standalone: true,
  templateUrl: './main-content-body.component.html',
  styleUrl: './main-content-body.component.scss',
  imports: [CommonModule, MessageContentComponent, UserPicComponent],
})
export class MainContentBodyComponent {
  constructor(
    public channelDetails: MatDialog,
    public dialog: MatDialog,
    public chatService: MessageService,
    public users: UsersService,
  ) {}

  getDirectMessageUser(currentChannel: Channel) {
    if (currentChannel) {
      let directUserId = currentChannel.users.filter(
        (user: any) => user !== this.chatService.currentUser
      );
      if (directUserId.length === 0 && currentChannel.users.length === 2) {
        directUserId.push(currentChannel.users[0]);
      }
      let directUser = this.users.getUserFromId(directUserId[0]);
      if (!directUser) {
        return 'User not found';
      }
      return directUser;
    }
    return 'Channel not found';
  }

  getDirectUserName() {
    let user = this.getDirectMessageUser(this.chatService.currentChannel);
    if (user.id === this.chatService.currentUser) {
      return user.name + ' (Du)';
    }
    return user.name;
  }

  getDirectMessageTitle() {
    let user = this.getDirectMessageUser(this.chatService.currentChannel);
    if (user.id === this.chatService.currentUser) {
      return true;
    }
    return false;
  }
  checkDirect(channel: Channel) {
    if (channel) {
      if (channel.name === channel.id) {
        return true;
      }
    }
    return false;
  }

  openUserData() {
    let user = this.getDirectMessageUser(this.chatService.currentChannel);
    this.dialog.open(DialogUserInfoComponent, {
      data: { id: user.id },
    });
  }

  openChannelData() {
    this.channelDetails.open(ChannelPopUpComponent, {
      data: { channel: this.chatService.currentChannel },
    });
  }

  getMessageTitle(channel: Channel) {
    let startText = '';
    if (channel) {
      if (channel.creator === this.chatService.currentUser) {
        startText = 'Du hast diesen Channel erstellt. ';
      }
      return startText;
    }
    return '';
  }
}
