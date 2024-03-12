import {
  Component,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { MessageService } from '../../../../services/message.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MainContentComponent } from '../../main-content.component';
import { IconHoverChangeImageComponent } from '../../../icon-hover-change-image/icon-hover-change-image.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { MentionModule } from 'angular-mentions';
import { UsersService } from '../../../../services/users.service';
import { UserPicComponent } from '../../../user-pic/user-pic.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { EditableSectionComponent } from '../../editable-section/editable-section.component';
@Component({
  selector: 'app-main-content-footer',
  standalone: true,
  templateUrl: './main-content-footer.component.html',
  styleUrl: './main-content-footer.component.scss',
  imports: [
    EditableSectionComponent,
    MatMenuModule,
    CommonModule,
    FormsModule,
    IconHoverChangeImageComponent,
    PickerModule,
    MentionModule,
    UserPicComponent,
    MatIconModule,
  ],
})
export class MainContentFooterComponent {
  @ViewChild('imageContainer') imageContainer!: ElementRef;
  @ViewChild('imageThreadContainer') imageThreadContainer!: ElementRef;
  @ViewChild('textAreaInput') textAreaInput!: ElementRef;
  @Input() mainChat: any;
  userList = [];
  constructor(
    private renderer: Renderer2,
    public chatService: MessageService,
    public mainContent: MainContentComponent,
    public users: UsersService
  ) {}
  tagText: string = '';
  textAreaContent: string = '';
  textAreaThreadContent: string = '';
  isEmojiPickerVisible: boolean = false;
  currentFiles: any[] = [];
  currentThreadFiles: any[] = [];

  allUsers: any = {};

  tile = {
    editable: false,
    tile: {
      content: {
        text: 'Angular Rocks !!',
        html: '<i>Angular </i><b>Rocks !!</b>',
      },
      background: '#2ecc71',
    },
  };

  ngOnInit(): void {
    this.allUsers = this.users.allUsers;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (
      !(event.target as HTMLElement).closest('.message-text-edit') &&
      !(event.target as HTMLElement).closest('.icon-smile') &&
      !(event.target as HTMLElement).closest('.emojis')
    ) {
      this.isEmojiPickerVisible = false;
    }
  }

  autoGrowTextZone(e: any) {
    e.target.style.height = '0px';
    e.target.style.height = e.target.scrollHeight + 25 + 'px';
  }

  checkForAtSymbol(event: KeyboardEvent) {
    if (event.key === '@') {
      this.chatService.mention = true;
    } else {
      this.chatService.mention = false;
    }
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

      if (nextChar !== '&nbsp;' && nextChar !== undefined) {
        let firstWord = text.indexOf('&nbsp;', atIndex);
        let secondWord = text.indexOf('&nbsp;', firstWord + 1);
        if (firstWord === -1) {
          firstWord = text.length;
        }

        const word = text.substring(atIndex + 1, secondWord);
        const cleanedWord = word.replace(/&nbsp;/g, ' ');

        const user = this.users.users.find((u: any) => u.name === cleanedWord);

        if (user) {
          highlightedText =
            highlightedText.substring(0, atIndex) +
            '<span class="tag">' +
            highlightedText.substring(atIndex, secondWord) +
            '</span>' +
            highlightedText.substring(secondWord);
        }
      }
    });

    return highlightedText;
  }

  tagPersons() {
    const textArea = this.textAreaInput.nativeElement;
    const startPos = textArea.selectionStart;
    const endPos = textArea.selectionEnd;

    const textBeforeCursor = this.textAreaContent.substring(0, startPos);
    const textAfterCursor = this.textAreaContent.substring(endPos);

    this.textAreaContent = textBeforeCursor + '@' + textAfterCursor;
    const atIndex = textBeforeCursor.length + 1;
   setTimeout(() =>{
    textArea.focus();
    textArea.setSelectionRange(atIndex, atIndex);
    this.chatService.mention = true;
   })

  }
  convertSpacesAndLineBreaksToHTML(text: string) {
    // Ersetze Leerzeichen durch HTML-Entity für Leerzeichen (&nbsp;)
    let htmlText = text.replace(/ /g, '&nbsp;');

    // Ersetze Zeilenumbrüche durch HTML-Element für Zeilenumbruch (<br>)
    htmlText = htmlText.replace(/\n/g, '<br>');

    return htmlText;
  }
  toText() {
    let text = this.textAreaContent;
    text = this.convertSpacesAndLineBreaksToHTML(text);

    text = this.highlightUsernames(text);
    // this.users.allUsers.forEach((user) => {
    //   let searchValue = `@${user}`;
    //   let index = text.indexOf(searchValue);
    //   while (index !== -1) {
    //     if (index === 0 || text[index - 1] === ' ') {
    //       text =
    //         text.substring(0, index) +
    //         `<span class="tag">${searchValue}</span>` +
    //         text.substring(index + searchValue.length);
    //     }
    //     index = text.indexOf(searchValue, index + 1);
    //   }
    // });

    return text;
  }

  tagUser(user: string) {
    const textArea = this.textAreaInput.nativeElement;
    const startPos = textArea.selectionStart;
    const endPos = textArea.selectionEnd;

    const textBeforeCursor = this.textAreaContent.substring(0, startPos);
    const textAfterCursor = this.textAreaContent.substring(endPos);

    this.textAreaContent = textBeforeCursor + user + ' ' + textAfterCursor;

    this.chatService.mention = false;

    setTimeout(() => {
        textArea.focus();
        textArea.setSelectionRange(startPos + user.length + 1, startPos + user.length + 1);
    });
}


  uploadFile() {
    let files;
    if (this.mainChat) {
      files = this.currentFiles;
    } else {
      files = this.currentThreadFiles;
    }
    files.forEach((file) => {
      this.chatService.handleUpload(file.file, file.refId);
    });
  }

  checkIsFileImg(files: any[]) {
    for (let i = 0; i < files.length; i++) {
      if (!files[i].file.type.startsWith('image/')) {
        return true;
      }
    }
    return false;
  }

  addFile(event: any) {
    let newFile = event.target.files[0];
    let id = this.generateRandomId(20);
    if (this.mainChat) {
      this.currentFiles.push({ refId: id, file: newFile, fileURL: null });
    } else {
      this.currentThreadFiles.push({ refId: id, file: newFile, fileURL: null });
    }
    if (newFile.type.startsWith('image/')) {
      this.renderImage(newFile);
    }
  }

  renderImage(file: any) {
    let reader = new FileReader();
    reader.onload = (e: any) => {
      const image = new Image();
      image.src = e.target.result;
      Object.assign(image.style, {
        padding: '12px',
        maxWidth: '200px',
        maxHeight: '200px',
        'object-fit': 'contain',
      });
      if (this.mainChat) {
        this.imageContainer.nativeElement.appendChild(image);
      } else {
        this.imageThreadContainer.nativeElement.appendChild(image);
      }
    };
    reader.readAsDataURL(file);
  }
  generateRandomId(length: number) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  addEmoji(event: { emoji: { native: any } }, mainChat: any) {
    if (mainChat) {
      this.textAreaContent = `${this.textAreaContent}${event.emoji.native}`;
    } else {
      this.textAreaThreadContent = `${this.textAreaThreadContent}${event.emoji.native}`;
    }
    this.isEmojiPickerVisible = false;
  }

  getPlaceholderText(): string {
    return this.mainChat
      ? `Nachricht an # ${this.chatService.getChannelName()}`
      : 'Antworten...';
  }

  getFilesId() {
    let listOfId: any[] = [];
    let files;
    if (this.mainChat) {
      files = this.currentFiles;
    } else {
      files = this.currentThreadFiles;
    }
    files.forEach((file) => {
      listOfId.push(file.refId);
    });
    return listOfId;
  }

  clearContent() {
    if (this.mainChat) {
      return this.renderer.setProperty(
        this.imageContainer.nativeElement,
        'innerHTML',
        ''
      );
    }

    return this.renderer.setProperty(
      this.imageThreadContainer.nativeElement,
      'innerHTML',
      ''
    );
  }

  sendMessage() {
    let fileIdList: string[] = this.getFilesId();
    if (fileIdList.length > 0) {
      this.uploadFile();
      this.clearContent();
    }
    if (this.mainChat) {
      let message = this.chatService.setMessage(this.textAreaContent);
      message.files = fileIdList;
      this.textAreaContent = '';
      this.chatService.saveAndAddNewMessage(message);
    } else {
      let message = this.chatService.setMessage(this.textAreaThreadContent);
      message.files = fileIdList;
      this.textAreaThreadContent = '';
      this.chatService.saveAndAddThreadMessage(message);
    }
    this.currentFiles = [];
  }
}
