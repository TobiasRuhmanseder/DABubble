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
    { name: 'Luke Skywalker', msg: '1', time: 1506562826977 },
    { name: 'Amarna Miller', msg: '2', time: 1706562826977 },
    {
      name: 'Max Mustermann',
      msg: '3 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque blandit odio efficitur lectus vestibulum, quis accumsan ante vulputate. Quisque tristique iaculis erat, eu faucibus lacus iaculis ac',
      time: 1706562826978,
    },
    {
      name: 'Amarna Miller',
      msg: '4 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque blandit odio efficitur lectus vestibulum, quis accumsan ante vulputate. Quisque tristique iaculis erat, eu faucibus lacus iaculis ac',
      time: 1706562826979,
    },
  ];

  textareaContent: string = '';
  eingeloggterUser: string = 'Max Mustermann';

  sortByTime() {
    this.channel1MsgTest.sort((b, a) => b.time - a.time);
    // this.channel1MsgTest.forEach((element, index) => {
    //   console.log(index, element)
    // })
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
    console.log(
      'Dies wird in den Channel gepusht = ' + msg,
      time,
      this.eingeloggterUser
    );
    this.channel1MsgTest.push({
      name: this.eingeloggterUser,
      msg: msg,
      time: time,
    });
    // console.log('Aktueller Stand vom Channel = ' + JSON.stringify(this.channel1MsgTest));
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
    return (
      currentTimestamp.getFullYear() > previousTimestamp.getFullYear() ||
      currentTimestamp.getMonth() > previousTimestamp.getMonth() ||
      currentTimestamp.getDate() > previousTimestamp.getDate()
    );
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
      let now = new Date();
      let oneYear = now.getFullYear() - year;
      if (oneYear > 0) {
        return `${day} ${dateOfMonth}. ${month} ${year}`;
      }
    }
    if (date.getDate() === new Date().getDate()) {
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
