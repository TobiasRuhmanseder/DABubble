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

  /**
   * Gets the user's name based on the provided username, reaction, and message.
   * @param {string} userName - The username of the user.
   * @param {string} reaction - The reaction type ('like').
   * @param {any} msg - The message object containing reaction information.
   * @returns {string} The user's name or a string indicating the current user.
   */
  getUserName(userName: string, reaction: string, msg: any) {
    if (userName === this.chatService.currentUser) {
      if (msg[`reaction${reaction}`].length > 1) {
        return 'und Du';
      }
      return 'Du';
    }
    return this.users.getUserName(userName);
  }

  /**
   * Sets the current user to the last position in the reaction array for the given message and reaction.
   * If the current user is already in the reaction array and there is more than one user in the array,
   * the current user is removed from their current position and added to the end of the array.
   * @param {any} msg - The message object containing the reaction array.
   * @param {string} reaction - The reaction string (e.g., "like", "love", etc.).
   * @returns {Array} The updated reaction array for the given message and reaction.
   */
  setSelfToLast(msg: any, reaction: string) {
    let user = this.chatService.currentUser;
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

  /**
   * Checks if the answer at the given index exists and has a non-empty thread list.
   * @param {number} i - The index of the answer to check.
   * @returns {boolean} True if the answer exists and has a non-empty thread list, false otherwise.
   */
  checkAnswer(i: number) {
    if (this.chatService.threadList[i] != undefined) {
      if (this.chatService.threadList[i].threadList.length > 0) {
        return true;
      }
    }
    return false;
  }

  /**
   * Retrieves the number of messages in a specific thread.
   * @param {number} i - The index of the thread in the threadList array.
   * @returns {number | string} The number of messages in the thread, or an empty string if the thread or its message list is undefined.
   */
  getThreadMessages(i: number) {
    if (this.chatService.threadList[i] != undefined) {
      if (this.chatService.threadList[i].threadList.length > 0) {
        return this.chatService.threadList[i].threadList.length;
      }
    }
    return '';
  }

  /**
   * Retrieves the timestamp of the last message in a specific thread.
   * @param {number} i - The index of the thread in the threadList array.
   * @returns {string} The formatted timestamp of the last message in the thread, or an empty string if the thread is undefined.
   */
  getThreadTimestamp(i: number) {
    if (this.chatService.threadList[i] != undefined) {
      return this.chatService.getMessageTime(
        this.chatService.threadList[i].threadList[
          this.chatService.threadList[i].threadList.length - 1
        ].timestamp
      );
    }
    return '';
  }
}
