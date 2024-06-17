import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { UsersService } from '../../../../services/users.service';
import { CommonModule } from '@angular/common';
import { MessageService } from '../../../../services/message.service';
import { FirebaseService } from '../../../../services/firebase.service';
import { Channel } from '../../../../models/channel.class';

@Component({
  selector: 'app-channel-pop-up',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    CommonModule,
  ],
  templateUrl: './channel-pop-up.component.html',
  styleUrl: './channel-pop-up.component.scss',
})
export class ChannelPopUpComponent {
  channelData: any;
  channelNameInput: string = '';
  channelDescriptionInput: string = '';
  editName: boolean = false;
  editDescription: boolean = false;
  constructor(
    private chatService: MessageService,
    private fire: FirebaseService,
    public users: UsersService,
    public dialogRef: MatDialogRef<ChannelPopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.channelData = this.data.channel;
    this.channelNameInput = this.channelData.name;
    this.channelDescriptionInput = this.channelData.description;
  }

  /**
   * Edits the channel name or description.
   *
   * @param {string} property - The property to edit ('name' or 'description').
   */
  editChannel(property: string) {
    if (property === 'name') {
      this.channelNameInput = this.channelData.name;
      this.editName = true;
    }
    if (property === 'description') {
      this.channelDescriptionInput = this.channelData.description;
      this.editDescription = true;
    }
  }

  /**
   * Saves the edited property (name or description) of a channel
   * @param {string} property - The property to be edited ('name' or 'description').
   */
  saveEdit(property: string) {
    if (property === 'name') {
      this.channelData.name = this.channelNameInput;
      this.editName = false;
    }
    if (property === 'description') {
      this.channelData.description = this.channelDescriptionInput;
      this.editDescription = false;
    }
    this.saveAndUpdateChannel(this.channelData);
  }

  /**
   * Saves the changes and exits the dialog window.
   * Removes the current user from the channel's user list and updates the channel data.
   */
  leaveChannel() {
    this.channelData.users = this.channelData.users.filter(
      (user: string) => user !== this.chatService.currentUser
    );
    this.saveAndUpdateChannel(this.channelData);
    this.onNoClick();
  }

  /**
    Saves and updates the channel data in Firestore
    @param {Channel} channelData - The channel data object to be saved/updated.
    */
  saveAndUpdateChannel(channelData: Channel) {
    let newData = new Channel(channelData);
    this.fire.updateChannel(newData);
  }

  /**
 * Closes the dialog.
 * @returns {void} This method does not return anything.
 */
  onNoClick(): void {
    this.dialogRef.close();
  }
}
