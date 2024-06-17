import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MessageService } from '../../../../../../services/message.service';
import { MatMenuModule } from '@angular/material/menu';
import { DialogUserInfoComponent } from '../../../../private-chat/dialog-user-info/dialog-user-info.component';
import { MatDialog } from '@angular/material/dialog';
import { UsersService } from '../../../../../../services/users.service';

@Component({
  selector: 'app-message-title',
  standalone: true,
  imports: [CommonModule, MatMenuModule],
  templateUrl: './message-title.component.html',
  styleUrl: './message-title.component.scss',
})
export class MessageTitleComponent {
  constructor(
    public chatService: MessageService,
    public dialog: MatDialog,
    public users: UsersService
  ) {}

  @Input() flagg: any;

  @Input() msg: any;
  @Input() i: any;
  @Input() isHover: any;
  @Input() list: any;
  @Input() mainChat: any;

  openUserDetails(id: string) {
    this.dialog.open(DialogUserInfoComponent, {
      data: { id: id },
    });
  }

  /**
   * Edits a message at the specified index.
   * @param {number} index - The index of the message to be edited.
   * @returns {void}
   */
  editMessage(index: number) {
    setTimeout(() => {
      if (this.mainChat) {
        return (this.chatService.editFlaggIndex = index);
      } else {
        return (this.chatService.editThreadFlaggIndex = index);
      }
    }, 1);
  }
}
