import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MessageContentComponent } from './message-content/message-content.component';
import { UsersService } from '../../../../services/users.service';
import { MessageService } from '../../../../services/message.service';
import { UserPicComponent } from '../../../user-pic/user-pic.component';
import { Channel } from '../../../../models/channel.class';
import { MatDialog } from '@angular/material/dialog';
import { DialogUserInfoComponent } from '../../private-chat/dialog-user-info/dialog-user-info.component';
import { ChannelPopUpComponent } from '../../channel/channel-pop-up/channel-pop-up.component';
import { IdToScrollService } from '../../../../services/id-to-scroll.service';

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
    private scroller: ViewportScroller,
    public scrollService: IdToScrollService
  ) {}

  /**
   * This method is a lifecycle hook that is called after the component's view has been initialized.
   * It calls the `getScrollToIdObservable` method to set up the scroll-to-id functionality.
   * @returns {void}
   */
  ngAfterViewInit() {
    this.getScrollToIdObservable();
  }

  /**
   * Retrieves the user in a direct message channel.
   * @param {Channel} currentChannel - The current channel object.
   * @returns {User|string} The user object in the direct message channel, or an error message if the user or channel is not found.
   */
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

  /**
   * Retrieves the name of the user in the direct message channel.
   * If the user is the current user, it appends ' (You)' to the name.
   * @returns {string} The name of the user in the direct message channel.
   */
  getDirectUserName() {
    let user = this.getDirectMessageUser(this.chatService.currentChannel);
    if (user.id === this.chatService.currentUser) {
      return user.name + ' (Du)';
    }
    return user.name;
  }

  /**
   * Checks if the current user is the direct message user for the current channel.
   * @returns {boolean} True if the current user is the direct message user, false otherwise.
   */
  getDirectMessageTitle() {
    let user = this.getDirectMessageUser(this.chatService.currentChannel);
    if (user.id === this.chatService.currentUser) {
      return true;
    }
    return false;
  }

  /**
   * Checks if a given channel is a direct message channel.
   * @param {Channel} channel - The channel object to check.
   * @returns {boolean} Returns true if the channel is a direct message channel, false otherwise.
   */
  checkDirect(channel: Channel) {
    if (channel) {
      if (channel.name === channel.id) {
        return true;
      }
    }
    return false;
  }

  /**
   * Opens a dialog to display user information.
   * Get the user object for the current direct message channel
   * Open the dialog with the user's ID as data
   * @returns {void}
   */
  openUserData() {
    let user = this.getDirectMessageUser(this.chatService.currentChannel);
    this.dialog.open(DialogUserInfoComponent, {
      data: { id: user.id },
    });
  }

  /**
   * Opens the channel data popup.
   * This method opens the ChannelPopUpComponent and passes the current channel data
   * from the chatService as the component's input data.
   */
  openChannelData() {
    this.channelDetails.open(ChannelPopUpComponent, {
      data: { channel: this.chatService.currentChannel },
    });
  }

  /**
   * Retrieves the message title for a given channel.
   * @param {Channel} channel - The channel object.
   * @returns {string} The message title.
   */
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

  @ViewChild('scrollTarget', { static: true }) scrollTarget!: ElementRef;
  /**
   * Subscribes to the `idToScroll$` observable from the `scrollService` and waits for an ID to scroll to.
   * When an ID is received, it calls the `waitAndScroll` method with the provided ID.
   * @returns {void}
   */
  getScrollToIdObservable() {
    this.scrollService.idToScroll$.subscribe((id) => {
      if (id) {
        this.waitAndScroll(id);
      }
    });
  }

  /**
 * Waits for an element with the given ID to exist in the DOM, and then scrolls to it smoothly.
 * If the element doesn't exist, it recursively calls itself until the element is found.
 * @param {string} id - The ID of the element to scroll to.
 */
  waitAndScroll(id: string) {
    requestAnimationFrame(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        this.scrollService.deleteId();
      } else {
        this.waitAndScroll(id);
      }
    });
  }
}
