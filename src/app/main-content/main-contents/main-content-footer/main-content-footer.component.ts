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
import { FirebaseService } from '../../../../services/firebase.service';
@Component({
  selector: 'app-main-content-footer',
  standalone: true,
  templateUrl: './main-content-footer.component.html',
  styleUrl: './main-content-footer.component.scss',
  imports: [
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
  @ViewChild('textThreadAreaInput') textThreadAreaInput!: ElementRef;
  @Input() mainChat: any;
  userList = [];
  constructor(
    private renderer: Renderer2,
    public chatService: MessageService,
    public mainContent: MainContentComponent,
    public users: UsersService,
    public fire: FirebaseService
  ) {
    this.getAllChannels();
  }
  tagText: string = '';
  textAreaContent: string = '';
  textAreaThreadContent: string = '';
  isEmojiPickerVisible: boolean = false;
  currentFiles: any[] = [];
  currentThreadFiles: any[] = [];
  allChannels: any[] = [];


  ngOnInit(): void {
  }

  @HostListener('document:click', ['$event'])
  /**
   * Handles the click event on the document.
   * @param {MouseEvent} event - The mouse event object.
   */
  onDocumentClick(event: MouseEvent) {
    if (
      !(event.target as HTMLElement).closest('.message-text-edit') &&
      !(event.target as HTMLElement).closest('.icon-smile') &&
      !(event.target as HTMLElement).closest('.emojis')
    ) {
      this.isEmojiPickerVisible = false;
    }
  }

  /**
   * Automatically grows the height of a text area element based on its content.
   * @param {any} e - The event object, which should contain the target element (text area).
   */
  autoGrowTextZone(e: any) {
    e.target.style.height = '0px';
    e.target.style.height = e.target.scrollHeight + 25 + 'px';
  }

  /**
   * Checks if the '@' symbol is pressed and sets the appropriate mention flag.
   * @param {KeyboardEvent} event - The keyboard event object.
   * @param {boolean} mainChat - A flag indicating whether the chat is the main chat or a thread.
   */
  checkForSymbol(event: KeyboardEvent, mainChat: boolean) {
    if (event.key === '@') {
      if (mainChat) {
        this.chatService.mention = true;
      } else {
        this.chatService.threadMention = true;
      }
    } else {
      this.chatService.mention = false;
      this.chatService.threadMention = false;
    }
    if (event.key === '#') {
      if (mainChat) {
        this.chatService.mentionChannel = true;
      } else {
        this.chatService.threadChannelMention = true;
      }
    } else {
      this.chatService.mentionChannel = false;
      this.chatService.threadChannelMention = false;
    }
  }

  /**
   * Highlights usernames in the given text by wrapping them with <span class="tag"></span>.
   * @param {string} text - The input text to highlight usernames in.
   * @returns {string} The text with usernames highlighted.
   */
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
        if (firstWord === -1) {
          firstWord = text.length;
        }

        const word = text.substring(atIndex + 1, secondWord);

        const user = this.users.users.find((u: any) => u.name === word);

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

  /**
   * Inserts an '@' symbol at the current cursor position in the text area,
   * allowing the user to tag other persons in the chat or thread.
   */
  tagPersons() {
    if (this.mainChat) {
      const textArea = this.textAreaInput.nativeElement;
      const startPos = textArea.selectionStart;
      const endPos = textArea.selectionEnd;

      const textBeforeCursor = this.textAreaContent.substring(0, startPos);
      const textAfterCursor = this.textAreaContent.substring(endPos);

      this.textAreaContent = textBeforeCursor + '@' + textAfterCursor;
      const atIndex = textBeforeCursor.length + 1;
      setTimeout(() => {
        textArea.focus();
        textArea.setSelectionRange(atIndex, atIndex);
        this.chatService.mention = true;
      });
    } else {
      const textArea = this.textThreadAreaInput.nativeElement;
      const startPos = textArea.selectionStart;
      const endPos = textArea.selectionEnd;

      const textBeforeCursor = this.textAreaThreadContent.substring(
        0,
        startPos
      );
      const textAfterCursor = this.textAreaThreadContent.substring(endPos);

      this.textAreaThreadContent = textBeforeCursor + '@' + textAfterCursor;
      const atIndex = textBeforeCursor.length + 1;
      setTimeout(() => {
        textArea.focus();
        textArea.setSelectionRange(atIndex, atIndex);
        this.chatService.threadMention = true;
      });
    }
  }

  /**
   * Tags a user in the chat input area.
   * @param {string} user - The username to be tagged.
   */
  tagUser(user: string) {
    if (this.mainChat) {
      const textArea = this.textAreaInput.nativeElement;
      const startPos = textArea.selectionStart;
      const endPos = textArea.selectionEnd;

      const textBeforeCursor = this.textAreaContent.substring(0, startPos);
      const textAfterCursor = this.textAreaContent.substring(endPos);

      this.textAreaContent = textBeforeCursor + user + ' ' + textAfterCursor;

      this.chatService.mention = false;
      this.chatService.threadMention = false;
      this.chatService.mentionChannel = false;
      this.chatService.threadChannelMention = false;

      setTimeout(() => {
        textArea.focus();
        textArea.setSelectionRange(
          startPos + user.length + 1,
          startPos + user.length + 1
        );
      });
    } else {
      const textArea = this.textThreadAreaInput.nativeElement;
      const startPos = textArea.selectionStart;
      const endPos = textArea.selectionEnd;

      const textBeforeCursor = this.textAreaThreadContent.substring(
        0,
        startPos
      );
      const textAfterCursor = this.textAreaThreadContent.substring(endPos);

      this.textAreaThreadContent =
        textBeforeCursor + user + ' ' + textAfterCursor;

      this.chatService.mention = false;
      this.chatService.threadMention = false;
      this.chatService.mentionChannel = false;
      this.chatService.threadChannelMention = false;

      setTimeout(() => {
        textArea.focus();
        textArea.setSelectionRange(
          startPos + user.length + 1,
          startPos + user.length + 1
        );
      });
    }
  }


  /**
   * Uploads files to the server.
   */
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

  /**
   * Checks if any of the provided files are not image files.
   * @param {any[]} files - An array of file objects.
   * @returns {boolean} Returns true if any of the files are not image files, false otherwise.
   */
  checkIsFileImg(files: any[]) {
    for (let i = 0; i < files.length; i++) {
      if (!files[i].file.type.startsWith('image/')) {
        return true;
      }
    }
    return false;
  }

  /**
   * Adds a new file to the current chat or thread.
   * @param {any} event - The event object containing the file data.
   */
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

  /**
   * Renders an image from a file.
   * @param {any} file - The file object representing the image.
   */
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

  /**
   * Generates a random string of characters with a specified length.
   * @param {number} length - The desired length of the random string.
   * @returns {string} A random string of characters with the specified length.
   */
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

  /**
   * Adds an emoji to the text area content or thread content based on the provided parameters.
   * @param {Object} event - An object containing the emoji information.
   * @param {Object} event.emoji - An object containing the emoji data.
   * @param {any} event.emoji.native - The native representation of the emoji.
   * @param {any} mainChat - A flag indicating whether the emoji should be added to the main chat or thread.
   */
  addEmoji(event: { emoji: { native: any } }, mainChat: any) {
    if (mainChat) {
      this.textAreaContent = `${this.textAreaContent}${event.emoji.native}`;
    } else {
      this.textAreaThreadContent = `${this.textAreaThreadContent}${event.emoji.native}`;
    }
    this.isEmojiPickerVisible = false;
  }

  /**
   * Returns the placeholder text for the chat input field based on the current channel and chat context.
   * @returns {string} The placeholder text for the chat input field.
   */
  getPlaceholderText(): string {
    if (!this.chatService.currentChannel) {
      return 'Starte eine neue Nachricht';
    }
    if (
      this.chatService.currentChannel.id != this.chatService.currentChannel.name
    ) {
      return this.mainChat
        ? `Nachricht an # ${this.chatService.getChannelName()}`
        : 'Antworten...';
    } else {
      return this.mainChat
        ? `Nachricht an ${this.getDirectMessageUser().name}`
        : 'Antworten...';
    }
  }

  /**
   * Retrieves the direct message user from the current channel.
   * @returns {string|User} Returns the direct message user object or 'User not found' if the user is not found.
   */
  getDirectMessageUser() {
    let directUserId = this.chatService.currentChannel.users.filter(
      (user: any) => user !== this.chatService.currentUser
    );
    if (
      directUserId.length === 0 &&
      this.chatService.currentChannel.users.length === 2
    ) {
      directUserId.push(this.chatService.currentChannel.users[0]);
    }
    let directUser = this.users.getUserFromId(directUserId[0]);
    if (!directUser) {
      return 'User not found';
    }
    return directUser;
  }

  /**
   * Retrieves an array of file IDs from either the main chat or the current thread.
   * @returns {any[]} An array of file IDs.
   */
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

  /**
   * Clears the content of the image container or image thread container.
   * @returns {void}
   */
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
  async getAllChannels() {
    this.allChannels = await this.fire.getAllChannels();
  }
  /**
   * Sends a message to the chat.
   * It handles the sending of a message to the chat.
   */
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
