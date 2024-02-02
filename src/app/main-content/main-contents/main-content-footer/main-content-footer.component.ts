import { Component } from '@angular/core';
import { MessageService } from '../../../../services/message.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MainContentComponent } from '../../main-content.component';

@Component({
  selector: 'app-main-content-footer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './main-content-footer.component.html',
  styleUrl: './main-content-footer.component.scss',
})
export class MainContentFooterComponent {
  constructor(
    public chatService: MessageService,
    public mainContent: MainContentComponent
  ) {}
  textareaContent: string = '';
  sendMessages() {
    let msg = this.textareaContent;
    let time = this.chatService.getTimeStamp();
    this.textareaContent = '';
    console.log(
      'Dies wird in den Channel gepusht = ' + msg,
      time,
      this.chatService.eingeloggterUser
    );
    this.chatService.channel1MsgTest.push({
      name: this.chatService.eingeloggterUser,
      msg: msg,
      time: time,
      editing: false,
    });
    setTimeout(() => {
      this.mainContent.scrollDown();
    }, 1);
  }
 
}
