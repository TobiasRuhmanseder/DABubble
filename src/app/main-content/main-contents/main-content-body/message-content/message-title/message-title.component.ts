import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MessageService } from '../../../../../../services/message.service';
import { MatMenuModule } from '@angular/material/menu';
import { DialogUserInfoComponent } from '../../../../private-chat/dialog-user-info/dialog-user-info.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-message-title',
  standalone: true,
  imports: [CommonModule, MatMenuModule],
  templateUrl: './message-title.component.html',
  styleUrl: './message-title.component.scss',
})
export class MessageTitleComponent {
  constructor(public chatService: MessageService, public dialog: MatDialog) {}

  @Input() msg: any;
  @Input() i: any;
  @Input() isHover: any;

  openUserDetails() {
    this.dialog.open(DialogUserInfoComponent, {});
  }
  addReaction(reaction: string, index: number) {
    let content = this.chatService.sortedMessages[index];
    let user = this.chatService.eingeloggterUser;
    this.updateReaction(reaction, content, user);
    this.chatService.setMessageAndUpdate(index);
  }
  private updateReaction(reaction: string, content: any, user: string) {
    if (content[`reaction${reaction}`].includes(user)) {
      deleteUser();
    } else {
      addUser();
    }

    function addUser() {
      content[`reaction${reaction}`].push(user);
    }

    function deleteUser() {
      content[`reaction${reaction}`].splice(
        content[`reaction${reaction}`].indexOf(user),
        1
      );
    }
  }
  editMessage(index: number) {
    setTimeout(() => {
      this.chatService.editFlaggIndex = index;
    }, 1);
  }
}
