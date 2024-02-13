import { Component } from '@angular/core';
import { MessageService } from '../../../../services/message.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MainContentComponent } from '../../main-content.component';
import { IconHoverChangeImageComponent } from '../../../icon-hover-change-image/icon-hover-change-image.component';
import { FirebaseService } from '../../../../services/firebase.service';
import { Message } from '../../../../models/message.class';

@Component({
  selector: 'app-main-content-footer',
  standalone: true,
  templateUrl: './main-content-footer.component.html',
  styleUrl: './main-content-footer.component.scss',
  imports: [CommonModule, FormsModule, IconHoverChangeImageComponent],
})
export class MainContentFooterComponent {
  constructor(
    public chatService: MessageService,
    public mainContent: MainContentComponent,
    public fire: FirebaseService
  ) {}

  textareaContent: string = '';

  sendMessage() {
    let message = this.chatService.setMessage(this.textareaContent);
    this.textareaContent = '';
    this.chatService.saveAndAddNewMessage(message);
    setTimeout(() => {
      this.mainContent.scrollDown();
    }, 1);
  }
}
