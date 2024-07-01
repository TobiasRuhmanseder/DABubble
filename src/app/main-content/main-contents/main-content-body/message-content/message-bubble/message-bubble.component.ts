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
  constructor(
    public dialog: MatDialog,
    private elementRef: ElementRef,
    public chatService: MessageService,
    private users: UsersService
  ) {}
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

  /**
   * Retrieves the files and adds a click event listener to each tag element.
   * @method ngAfterViewInit
   * @description This method is called after the component's view has been initialized.
   * It retrieves the files from the `msg.files` property and adds a click event listener
   * to each tag element found in the component's template.
   */
  ngAfterViewInit() {
    this.getFiles(this.msg.files);
    const elements = this.elementRef.nativeElement.querySelectorAll('.tag');

    elements.forEach((element: any) => {
      element.addEventListener('click', () => {
        this.handleClick(this.getUserIdFromClass(element));
      });
    });
  }

  /**
   * Retrieves the user ID from the class attribute of an HTML element.
   * @param {HTMLElement} element - The HTML element from which to retrieve the user ID.
   * @returns {string} The user ID extracted from the class attribute, or 'user.id not found' if no user ID is found.
   */
  getUserIdFromClass(element: HTMLElement) {
    const classes = Array.from(element.classList);
    for (let className of classes) {
      if (className !== 'tag') {
        return className;
      }
    }
    return 'user.id nicht gefunden';
  }

  /**
   * Opens a dialog to display user information.
   * @param {string} userId - The ID of the user whose information should be displayed.
   * @returns {void}
   */
  handleClick(userId: string) {
    this.dialog.open(DialogUserInfoComponent, {
      data: { id: userId },
    });
  }

  /**
   * Aborts the edit message operation.
   * @description This function resets the edit flag indices in the chat service,
   * effectively aborting the edit message operation.
   */
  abortEditMessage() {
    this.chatService.editFlaggIndex = -1;
    this.chatService.editThreadFlaggIndex = -1;
  }

  /**
   * Checks if the message is from the main chat or a thread, and saves the edited message content.
   * @param {number} index - The index of the message in the list.
   * @param {any} mainChat - A flag indicating whether the message is from the main chat or a thread.
   */
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

  /**
   * Adds the selected emoji to the message content.
   * @param {Object} event - The event object containing the selected emoji.
   * @param {Object} event.emoji - The emoji object.
   * @param {any} event.emoji.native - The native representation of the emoji.
   */
  addEmoji(event: { emoji: { native: any } }) {
    this.msg.content = `${this.msg.content}${event.emoji.native}`;
    this.isEmojiPickerVisible = false;
  }

  /**
   * Checks if the input is from the main chat or a thread and returns the corresponding input value.
   * @param {number} index - The index of the input element.
   * @param {any} mainChat - A flag indicating whether the input is from the main chat or a thread.
   * @returns {string} The value of the input element.
   */
  checkIfThread(index: number, mainChat: any) {
    if (mainChat) {
      return (document.getElementById('input_' + index) as HTMLTextAreaElement)
        .value;
    }
    return (
      document.getElementById('inputThread_' + index) as HTMLTextAreaElement
    ).value;
  }

  /**
   * Checks if files or images are present and renders them accordingly.
   * @async
   * @function
   * @param {any} fileIdList - A list of file IDs.
   * @returns {Promise<void>}
   */
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

  /**
   * Downloads a file by creating a temporary URL and simulating a click on an anchor tag.
   * @param {any} file - An object containing the file data and metadata.
   * @param {string} file.fileURL - The URL or data of the file to be downloaded.
   * @param {Object} file.metaData - An object containing metadata about the file.
   * @param {string} file.metaData.contentType - The MIME type of the file.
   * @param {Object} file.metaData.customMetadata - An object containing custom metadata about the file.
   * @param {string} file.metaData.customMetadata.originalName - The original name of the file.
   */
  downloadFile(file: any): void {
    const blob = new Blob([file.fileURL], { type: file.metaData.contentType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.metaData.customMetadata.originalName; // Setze den Dateinamen über das "download" Attribut
    a.click();
    window.URL.revokeObjectURL(url);
  }

  /**
   * Renders an image element in the DOM.
   * @param {string} fileURL - The URL of the image file to be rendered.
   * @param {number} index - The index of the element in the fileContentList array where the image should be appended.
   */
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

  /**
   * Converts the given content string to HTML format.
   * It highlights usernames within the content.
   * @param {string} content - The input string to be converted to HTML.
   * @returns {string} The HTML-formatted string with highlighted usernames.
   */
  toHTML(content: string) {
    let text = content;
    text = this.highlightUsernames(text);
    return text;
  }

  /**
   * Iterates over the provided indices and highlights words in the text that match user names.
   * @param {number[]} indices - An array of indices in the text where the highlighting should start.
   * @param {string} text - The text to be processed.
   * @param {Object[]} users - An array of user objects with `name` and `id` properties.
   * @returns {string} The highlighted text with user names wrapped in `<span>` tags.
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
