import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss',
})
export class MainContentComponent {
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
  channel1Msg: { name: string; msg: string; time: number }[] = [
    { name: 'Luke Skywalker', msg: 'hallo welt!', time: 1706455915320 },
    { name: 'Amarna Miller', msg: 'hei da welt!', time: 1705455425320 },
    {
      name: 'Max Mustermann',
      msg: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque blandit odio efficitur lectus vestibulum, quis accumsan ante vulputate. Quisque tristique iaculis erat, eu faucibus lacus iaculis ac',
      time: 1707435925320,
    },
    {
      name: 'Amarna Miller',
      msg: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque blandit odio efficitur lectus vestibulum, quis accumsan ante vulputate. Quisque tristique iaculis erat, eu faucibus lacus iaculis ac',
      time: 1709995925320,
    },
  ];

  channelUserPics: any = [];
  msgOwner: string = '';
  textareaContent: string = '';
  eingeloggterUser: string = 'Max Mustermann';

  sortByTime() {
    this.channel1Msg.sort((b, a) => b.time - a.time);
    return this.channel1Msg;
  }

  checkNextDay(index: number) {
    const currentTimestamp = new Date(this.channel1Msg[index].time);
    const nextTimestamp = new Date(this.channel1Msg[index + 1].time);

    if (nextTimestamp.getDate() > currentTimestamp.getDate()) {
      console.log('Ein neuer Tag hat begonnen!');
      return true;
    }
    return false;
  }

  checkaNextDay(index: number) {
    let nextDay: any = this.startNextDay(index);
    let day1 = this.channel1Msg[index].time;
    if (this.channel1Msg[index].time > this.channel1Msg[index - 1].time) {
      return true;
    }
    return false;
  }

  startNextDay(index: number) {
    const naechsterTag = new Date(this.channel1Msg[index].time);
    naechsterTag.setDate(naechsterTag.getDate() + 1);
    return naechsterTag;
  }

  renderMessagePic(index: number) {
    let user = this.usersTest.user.indexOf(this.channel1Msg[index].name);
    let pic = this.usersTest.picURL[user];
    return pic;
  }

  getTimeStamp() {
    let now = new Date();
    let timestamp = now.getTime();

    let date = new Date();
    let timedatestamp = date.getDate();
    return timestamp;
  }

  sendMessages() {
    let msg = this.textareaContent;
    let time = this.getTimeStamp();
    this.textareaContent = '';
    console.log(msg, time, this.eingeloggterUser);
  }

  getUserPic(user: string) {
    let index = this.usersTest.user.indexOf(user);

    return this.usersTest.picURL[index];
  }

  getMessageTime(timestamp: number) {
    let date = new Date(timestamp);
    let timeText = date.getHours() + ':' + date.getMinutes();
    return timeText;
  }

  getFormattedDate(timestamp: number) {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    let date = new Date(timestamp);
    let day = days[date.getDay()];
    let dateOfMonth = date.getDate();
    let month = months[date.getMonth()];

    return `${day} ${dateOfMonth}. ${month}`;
  }
}
