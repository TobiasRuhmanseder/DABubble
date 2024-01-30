import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ChannelComponent } from './channel/channel.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [ChannelComponent, CommonModule, FormsModule],
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
  channel1Test = {
    name: 'coolster Channel',
    users: ['Max Mustermann', 'Amarna Miller', 'Luke Skywalker'],
  };
  channel1MsgTest: { name: string; msg: string; time: number }[] = [
    { name: 'Luke Skywalker', msg: 'hallo welt!', time: 1506562826977 },
    { name: 'Amarna Miller', msg: 'hei da welt!', time: 1706562826977 },
    {
      name: 'Max Mustermann',
      msg: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque blandit odio efficitur lectus vestibulum, quis accumsan ante vulputate. Quisque tristique iaculis erat, eu faucibus lacus iaculis ac',
      time: 1706562826977,
    },
    {
      name: 'Amarna Miller',
      msg: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque blandit odio efficitur lectus vestibulum, quis accumsan ante vulputate. Quisque tristique iaculis erat, eu faucibus lacus iaculis ac',
      time: 1706562826977,
    },
  ];

  textareaContent: string = '';
  eingeloggterUser: string = 'Max Mustermann';

  sortByTime() {
    this.channel1MsgTest.sort((b, a) => b.time - a.time);
    return this.channel1MsgTest;
  }

  renderMessagePic(index: number) {
    let user = this.usersTest.user.indexOf(this.channel1MsgTest[index].name);
    let pic = this.usersTest.picURL[user];
    return pic;
  }

  getTimeStamp() {
    let now = new Date();
    let timestamp = now.getTime();
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

  checkNextDay(index: number) {
    if (index === 0) {
      return true;
    }
    const currentTimestamp = new Date(this.channel1MsgTest[index].time);
    const previousTimestamp = new Date(this.channel1MsgTest[index - 1].time);
    return this.checkNextTime(currentTimestamp, previousTimestamp);
  }

  checkNextTime(currentTimestamp: Date, previousTimestamp: Date) {
    if (currentTimestamp.getFullYear() > previousTimestamp.getFullYear()) {
      return true + 'Year';
    }
    if (currentTimestamp.getMonth() > previousTimestamp.getMonth()) {
      return true + 'Month';
    }
    if (currentTimestamp.getDate() > previousTimestamp.getDate()) {
      return true + 'Day';
    }

    return false;
  }

  renderDate(
    index: number,
    date: Date,
    day: string,
    dateOfMonth: number,
    month: string,
    year: number
  ) {
    if (index < this.channel1MsgTest.length) {
      let checkNextTime = this.checkNextTime(
        new Date(this.channel1MsgTest[index + 1].time),
        date
      );
      if (checkNextTime === 'trueYear') {
        return `${day} ${dateOfMonth}. ${month} ${year}`;
      }
    }
    let today = new Date();
    if (date.getDate() === today.getDate()) {
      return 'Heute';
    }
    return `${day} ${dateOfMonth}. ${month}`;
  }

  getFormattedDate(timestamp: number, index: number) {
    const months = [
      'Januar',
      'Februar',
      'März',
      'April',
      'Mai',
      'Juni',
      'Juli',
      'August',
      'September',
      'Oktober',
      'November',
      'Dezember',
    ];
    const days = [
      'Sonntag',
      'Montag',
      'Dienstag',
      'Mittwoch',
      'Donnerstag',
      'Freitag',
      'Samstag',
    ];

    let date = new Date(timestamp);
    let day = days[date.getDay()];
    let dateOfMonth = date.getDate();
    let month = months[date.getMonth()];
    let year = date.getFullYear();
    return this.renderDate(index, date, day, dateOfMonth, month, year);
  }
}
