import { Injectable } from '@angular/core';
import { FirebaseServiceService } from './firebase-service.service';
import { Channel } from '../models/channel.class';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(public fire: FirebaseServiceService) {}

  allChannels: any[] = [];
  currentChannel: Channel[] = [];
  allUsers: any[] = [];

  async getAllChannels() {
    this.allChannels = [];
    const QuerySnapshot = await this.fire.getDocsRef('channels');
    QuerySnapshot.forEach((doc) => {
      this.allChannels.push(
        new Channel({ id: doc.id, ...doc.data() }).toJSON()
      );
    });
    console.log('from getAllChannels()', this.allChannels);
    return this.allChannels;
  }
  async getCurrentChannel() {
    this.allChannels = await this.getAllChannels();
    this.currentChannel = await this.getChannel('kShBVOfrw9cz8gkKWjOq');
  }

  async getChannel(channelId: string) {
    this.currentChannel = this.allChannels.find(
      (channel) => channel.id === channelId
    );
    console.log('from getChannel', this.currentChannel);
    return this.currentChannel;
  }

  async getAllUsers() {
    this.allUsers = [];
    const QuerySnapshot = await this.fire.getDocsRef('users');
    QuerySnapshot.forEach((doc) => {
      this.allUsers.push(new Channel({ id: doc.id, ...doc.data() }).toJSON());
    });
    console.log('from getAllUsers()', this.allUsers);
  }
  loadMsg() {
    let channel = this.fire.getMsgRef();
    console.log('load Messages',channel)

 
  }
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

  // die users werden codiert in ID nummern
  channel1Test = {
    name: 'coolster TestChannel',
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

  toggleThread() {
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
