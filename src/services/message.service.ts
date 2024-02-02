import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
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
  channel1MsgTest: {
    name: string;
    msg: string;
    time: number;
    editing: boolean;
  }[] = [
    {
      name: 'Luke Skywalker',
      msg: 'Hallo Welt!',
      time: 1506562826977,
      editing: false,
    },
    {
      name: 'Amarna Miller',
      msg: 'Hei, wie gehts?',
      time: 1706562826977,
      editing: false,
    },
    {
      name: 'Max Mustermann',
      msg: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque blandit odio efficitur lectus vestibulum, quis accumsan ante vulputate. Quisque tristique iaculis erat, eu faucibus lacus iaculis ac 3 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque blandit odio efficitur lectus vestibulum, quis accumsan ante vulputate. Quisque tristique iaculis erat, eu faucibus lacus iaculis ac3 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque blandit odio efficitur lectus vestibulum, quis accumsan ante vulputate. Quisque tristique iaculis erat, eu faucibus lacus iaculis ac',
      time: 1706562826978,
      editing: false,
    },
    {
      name: 'Amarna Miller',
      msg: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque blandit odio efficitur lectus vestibulum, quis accumsan ante vulputate. Quisque tristique iaculis erat, eu faucibus lacus iaculis ac',
      time: 1706562826979,
      editing: false,
    },
  ];

  eingeloggterUser: string = 'Max Mustermann';
  editFlagg: boolean = false;
  threadIsOpen = true;

  toggleThread(){
    this.threadIsOpen = !this.threadIsOpen;
  }

  getTimeStamp() {
    let timestamp = new Date().getTime();
    return timestamp;
  }

  renderMessagePic(index: number) {
    let user = this.usersTest.user.indexOf(this.channel1MsgTest[index].name);
    let pic = this.usersTest.picURL[user];
    return pic;
  }

  sortMessagesByTime() {
    this.channel1MsgTest.sort((b, a) => b.time - a.time);
    return this.channel1MsgTest;
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
  getMessageTime(timestamp: number) {
    let date = new Date(timestamp);
    let timeText = date.getHours() + ':' + date.getMinutes();
    return timeText;
  }
}
