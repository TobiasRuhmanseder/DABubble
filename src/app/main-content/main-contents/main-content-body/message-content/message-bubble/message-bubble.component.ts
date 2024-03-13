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
import { UsersService } from '../../../../../../services/users.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogUserInfoComponent } from '../../../../private-chat/dialog-user-info/dialog-user-info.component';

@Component({
  selector: 'app-message-bubble',
  standalone: true,
  imports: [CommonModule, TextFieldModule, FormsModule, PickerModule],
  templateUrl: './message-bubble.component.html',
  styleUrl: './message-bubble.component.scss',
})
export class MessageBubbleComponent {
  @ViewChildren('fileContent') fileContentList!: QueryList<ElementRef>;
  @ViewChildren('fileThreadContent')
  fileContentThreadList!: QueryList<ElementRef>;
  constructor(public dialog: MatDialog,private elementRef: ElementRef, public chatService: MessageService, private users: UsersService) {}
  isEmojiPickerVisible: boolean = false;

  @Input() flagg: any;
  @Input() msg: any;
  @Input() i: any;
  @Input() isHover: any;
  @Input() list: any;
  @Input() mainChat: any;
  files: any[] = [];

  styleProberty = {
    maxWidth: '200px',
    maxHeight: '200px',
    'object-fit': 'contain',
    cursor: 'pointer',
    'border-radius': '12px',
  };

  ngAfterViewInit() {
    this.getFiles(this.msg.files);
    const elements = this.elementRef.nativeElement.querySelectorAll('.tag');
    
    elements.forEach((element: any) => {
        element.addEventListener('click', () => {
            this.handleClick(this.getUserIdFromClass(element));
        });
    });
  }

  getUserIdFromClass(element: HTMLElement) {
    const classes = Array.from(element.classList);
    for (let className of classes) {
        if (className !== 'tag') {
            return className;
        }
    }
    return 'user.id nicht gefunden';
}
  handleClick(userId: string) {
    console.log('Clicked on user ID:', userId);
    this.dialog.open(DialogUserInfoComponent, {
      data: { id: userId }
    });
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
        fileIdList.map((fileId: string) =>
          this.chatService.handleDownload('msg_files/' + fileId, 5)
        )
      );
      fileURLs.forEach((file, i) => {
        if (!file.metaData.contentType.startsWith('image/')) {
          this.files.push(file);
        } else {
          this.renderImage(file.fileURL, i);
        }
      });
    }
  }

  downloadFile(file: any): void {
    const blob = new Blob([file.fileURL], { type: file.metaData.contentType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.metaData.customMetadata.originalName; // Setze den Dateinamen über das "download" Attribut
    a.click();
    window.URL.revokeObjectURL(url);
  }

  renderImage(fileURL: string, index: number) {
    let elementsArray;
    elementsArray = this.fileContentList.toArray();
    const element = elementsArray[index];
    const img = new Image();
    img.src = fileURL;
    Object.assign(img.style, this.styleProberty);
    img.onclick = () => {
      window.open(fileURL, '_blank');
    };
    element.nativeElement.appendChild(img);
  }

  toHTML(content:string){
let text = content;
text = this.highlightUsernames(text)
return text
  }

  highlightUsernames(text: string) {
    let highlightedText = text;
    let indices: any[] = [];

    for (let i = text.length; i > -1; i--) {
      if (text[i] === '@') {
        indices.push(i);
      }
    }

    indices.forEach((atIndex) => {
      const nextChar = text[atIndex + 1];

      if (nextChar !== ' ' && nextChar !== undefined) {
        let firstWord = text.indexOf(' ', atIndex);
        let secondWord = text.indexOf(' ', firstWord + 1);
        let nextLineBreakIndex = text.indexOf('\n', firstWord + 1);

        if (secondWord !== -1 && secondWord < nextLineBreakIndex) {
        } else if (nextLineBreakIndex !== -1) {
            secondWord = nextLineBreakIndex;
        }
        if (firstWord === -1) {
          firstWord = text.length;
        }
        if (secondWord === -1) {
          secondWord = text.length;
        }

        const word = text.substring(atIndex + 1, secondWord);

        const user = this.users.users.find((u: any) => u.name === word);

        if (user) {
          highlightedText =
              highlightedText.substring(0, atIndex) +
              `<span class="tag ${user.id}"> ` +
              highlightedText.substring(atIndex, secondWord) +
              ' </span>' +
              highlightedText.substring(secondWord);
      }
      }
    });

    return highlightedText;
  }
 
}
