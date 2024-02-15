import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { MessageService } from '../../../../../../services/message.service';
import { TextFieldModule } from '@angular/cdk/text-field';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-message-bubble',
  standalone: true,
  imports: [CommonModule, TextFieldModule, FormsModule, PickerModule],
  templateUrl: './message-bubble.component.html',
  styleUrl: './message-bubble.component.scss',
})
export class MessageBubbleComponent {
  @ViewChildren('fileContent') fileContentList!: QueryList<ElementRef>;
  @ViewChildren('fileThreadContent') fileContentThreadList!: QueryList<ElementRef>;
  constructor(public chatService: MessageService) {}
  isEmojiPickerVisible: boolean = false;

  @Input() flagg: any;
  @Input() msg: any;
  @Input() i: any;
  @Input() isHover: any;
  @Input() list: any;
  @Input() mainChat: any;

  ngAfterViewInit() {
    this.getFiles(this.msg.files);
  }

  abortEditMessage() {
    this.chatService.editFlaggIndex = -1;
    this.chatService.editThreadFlaggIndex = -1;
  }
  saveEditMessage(index: number, mainChat: any) {
    let editContent = this.checkIfThread(index, mainChat);
    if (this.list[index].content != editContent) {
      this.list[index].content = editContent;
      if (mainChat) {
        this.chatService.setMessageAndUpdate(index);
      } else {
        this.chatService.setThreadMessagesAndUpdate(index, this.msg.id);
      }
    }
    this.abortEditMessage();
  }
  addEmoji(event: { emoji: { native: any } }) {
    this.msg.content = `${this.msg.content}${event.emoji.native}`;
    this.isEmojiPickerVisible = false;
  }

  checkIfThread(index: number, mainChat: any) {
    if (mainChat) {
      return (document.getElementById('input_' + index) as HTMLTextAreaElement)
        .value;
    }
    return (
      document.getElementById('inputThread_' + index) as HTMLTextAreaElement
    ).value;
  }

  async getFiles(fileIdList: any) {
    if (fileIdList && fileIdList.length > 0) {
      const fileURLs = await Promise.all(
        this.chatService.getSingleFile(fileIdList)
      );

      fileURLs.forEach((fileURL, i) => {
        this.renderImage(fileURL, i);
      });
    }
  }

  renderImage(fileURL: string, index: number) {
    let elementsArray;
    if (this.mainChat) {
      elementsArray = this.fileContentList.toArray();
    } else {
      elementsArray = this.fileContentThreadList.toArray();
    }
    const element = elementsArray[index];
    const img = new Image();
    img.src = fileURL;
    Object.assign(img.style, {
      padding: '12px',
      maxWidth: '200px',
      maxHeight: '200px',
      'object-fit': 'contain',
    });
    element.nativeElement.appendChild(img);
  }
}
