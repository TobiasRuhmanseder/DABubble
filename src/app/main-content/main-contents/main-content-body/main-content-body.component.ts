import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { MessageService } from '../../../../services/message.service';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MainContentComponent } from '../../main-content.component';
import { MatMenuModule } from '@angular/material/menu';
import { FirebaseService } from '../../../../services/firebase.service';
import { Message } from '../../../../models/message.class';

@Component({
  selector: 'app-main-content-body',
  standalone: true,
  imports: [CommonModule, TextFieldModule, MatMenuModule],
  templateUrl: './main-content-body.component.html',
  template: ` <textarea cdkTextareaAutosize></textarea> `,

  styleUrl: './main-content-body.component.scss',
})
export class MainContentBodyComponent implements AfterViewInit {
  constructor(
    public chatService: MessageService,
    public mainContent: MainContentComponent,
    private fire: FirebaseService
  ) {}
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.mainContent.scrollDown();
    }, 300);
    setTimeout(() => {
      this.mainContent.scrollDown();
    }, 600);
    setTimeout(() => {
      this.mainContent.scrollDown();
    }, 1000);
  }

  getUserName(userName: string, reaction: string, msg: any) {
    if (userName === this.chatService.eingeloggterUser) {
      if (msg[`reaction${reaction}`].length > 1) {
        return 'und Du';
      }
      return 'Du';
    }
    return userName;
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

  editMessage(index: number) {
    setTimeout(() => {
      this.chatService.editFlaggIndex = index;
    }, 1);
  }
  abortEditMessage() {
    this.chatService.editFlaggIndex = -1;
  }
  saveEditMessage(index: number) {
    let editContent = (
      document.getElementById('input_' + index) as HTMLTextAreaElement
    ).value;
    this.chatService.sortedMessages[index].content = editContent;
    this.setMessageAndUpdate(index);
    this.chatService.editFlaggIndex = -1;
  }

  addReaction(reaction: string, index: number) {
    let content = this.chatService.sortedMessages[index];
    let user = this.chatService.eingeloggterUser;
    this.updateReaction(reaction, content, user);
    this.setMessageAndUpdate(index);
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

  private setMessageAndUpdate(index: number) {
    let newMessage = new Message(this.chatService.sortedMessages[index]);
    this.fire.updateMessage(
      this.chatService.currentChannel[0].id,
      this.chatService.sortedMessages[index].id,
      newMessage
    );
  }
}
