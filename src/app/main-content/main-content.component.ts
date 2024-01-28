import { CommonModule } from '@angular/common';
import {  AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss',
})
export class MainContentComponent implements OnInit {
  ngOnInit(): void {
    this.generateUserPics();
  }

  usersTest = {
    user: ['max mustermann', 'Luke Skywalker'],
    picURL: ['Frederik_Beck.png', 'Noah_Braun.png'],
  };
  channel1 = {
    name: 'coolster Channel',
    users: ['max mustermann', 'Luke Skywalker'],
  };
  channel1Msg = {
    msg1: { name: 'user1', msg: 'hallo welt!', time: '01011101' },
    msg2: { name: 'user2', msg: 'hei da welt!', time: '01011022' },
  };
  channelUserPics: any = [];
  generateUserPics() {
    for (let i = 0; i < this.channel1.users.length; i++) {
      let searchIndex: number = this.usersTest.user.indexOf(
        this.channel1.users[i]
      );
      this.channelUserPics.push(this.usersTest.picURL[searchIndex]);
    }
  }
}
