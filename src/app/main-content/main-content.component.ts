import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss',
})
export class MainContentComponent {
  @ViewChild('scroller') private scroller!: ElementRef;

  ngAfterViewInit(): void {
    const scrollingElement = this.scroller.nativeElement;
    const config = { childList: true };
    const callback = (mutationsList: any, observer: any) => {
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
          window.scrollTo(0, document.body.scrollHeight);
        }
      }
    };
    const observer = new MutationObserver(callback);
    observer.observe(scrollingElement, config);
  }

  // constructor(public scroller: ViewportScroller) {}

  usersTest = {
    user: [
      'Max Mustermann',
      'Luke Skywalker',
      'Amarna Miller',
      'Max Mustermann',
      'Luke Skywalker',
      'Amarna Miller',
    ],
    picURL: [
      'Frederik_Beck.png',
      'Noah_Braun.png',
      'Elise_Roth.png',
      'Frederik_Beck.png',
      'Noah_Braun.png',
      'Elise_Roth.png',
    ],
  };
  channel1 = {
    name: 'coolster Channel',
    users: ['Max Mustermann', 'Amarna Miller', 'Luke Skywalker'],
  };
  channel1Msg = [
    { name: 'Luke Skywalker', msg: 'hallo welt!', time: '1706455925320' },
    { name: 'Amarna Miller', msg: 'hei da welt!', time: '1706455925320' },
    {
      name: 'Max Mustermann',
      msg: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque blandit odio efficitur lectus vestibulum, quis accumsan ante vulputate. Quisque tristique iaculis erat, eu faucibus lacus iaculis ac',
      time: '1706455925320',
    },
    {
      name: 'Amarna Miller',
      msg: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque blandit odio efficitur lectus vestibulum, quis accumsan ante vulputate. Quisque tristique iaculis erat, eu faucibus lacus iaculis ac',
      time: '1706455925320',
    },
  ];

  channelUserPics: any = [];
  msgOwner: string = '';
  textareaContent: string = '';
  eingeloggterUser: string = 'Max Mustermann';

  renderMessagePic(index: number) {
    let user = this.usersTest.user.indexOf(this.channel1Msg[index].name);
    let pic = this.usersTest.picURL[user];
    return pic;
  }

  getTimeStamp() {
    // Create a new Date object
    let now = new Date();
    // Get the timestamp in milliseconds
    let timestamp = now.getTime();

    let date = new Date();
    let timedatestamp = date.getDate();
    return timestamp;
    // let hour =  now.getHours();
    // let minutes =  now.getMinutes();
    // console.log(hour, minutes);

    // // Das Datum in lesbarer Form erhalten (z.B. "Monat Tag, Jahr")
    // let readableDate = date.toLocaleDateString();
    // console.log(readableDate);
    // // Die Uhrzeit in lesbarer Form erhalten (z.B. "Stunde:Minute:Sekunde")
    // let readableTime = date.toLocaleTimeString();

    // console.log(readableTime);
    // // Kombinieren Sie Datum und Uhrzeit nach Bedarf
    // let readableDateTime = date.toLocaleString();
    // console.log(readableDateTime);
  }

  sendMessages() {
    let msg = this.textareaContent;
    let time = this.getTimeStamp();
    this.textareaContent = '';
    let newMsgKey = 'msg' + (Object.keys(this.channel1Msg).length + 1); // Erzeugt den Schlüssel für die neue Nachricht (z.B. 'msg3')
    let newMsg = { name: this.eingeloggterUser, msg: msg, time: time };
    console.log(msg, time, this.eingeloggterUser);
  }

  getUserPic(user: string) {
    let index = this.usersTest.user.indexOf(user);

    return this.usersTest.picURL[index];
  }

  getMessageTime(timeInString: string) {
    let timestampInMs = parseInt(timeInString);
    let now = new Date(timestampInMs);
    let hour = now.getHours();
    let minutes = now.getMinutes();
    let text = hour + ':' + minutes;
    return text;
  }

  // scrollToAnchor(anchorId: string): void {
  //   const element = document.getElementById(anchorId);
  //   if (element) {
  //     this.scroller.scrollToAnchor(anchorId);
  //   }
  // }
}
