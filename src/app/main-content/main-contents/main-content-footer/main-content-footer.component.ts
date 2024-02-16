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
@Component({
  selector: 'app-main-content-footer',
  standalone: true,
  templateUrl: './main-content-footer.component.html',
  styleUrl: './main-content-footer.component.scss',
  imports: [
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
  @Input() mainChat: any;
  userList = [];
  constructor(
    private renderer: Renderer2,
    public chatService: MessageService,
    public mainContent: MainContentComponent,
    public users: UsersService
  ) {}
  textAreaContent: string = '';
  textAreaThreadContent: string = '';
  isEmojiPickerVisible: boolean = false;
  currentFiles: any[] = [];
  currentThreadFiles: any[] = [];

  allUsers: any = {};

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
