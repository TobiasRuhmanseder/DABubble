import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { UserPicComponent } from '../../user-pic/user-pic.component';
import { Subject, debounceTime } from 'rxjs';
import { UsersService } from '../../../services/users.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrentUserService } from '../../../services/current-user.service';
import { FirebaseService } from '../../../services/firebase.service';
import { Firestore, getDocs } from '@angular/fire/firestore';
import { collection } from '@firebase/firestore';
import { Channel } from '../../../models/channel.class';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [UserPicComponent, CommonModule, FormsModule],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss'
})
export class SearchInputComponent implements OnInit, OnDestroy {
  filteredChannel: any[] = [];
  filteredUsers: any[] = [];
  filteredMessages: any[] = [];
  channelMessages: any[] = [];

  input$ = new Subject<string>();
  dropDownList = false;
  inputValue: any;

  usersService: UsersService = inject(UsersService);
  FirebaseService: FirebaseService = inject(FirebaseService);
  currentUserService: CurrentUserService = inject(CurrentUserService);
  firestore: Firestore = inject(Firestore);
  currentUser: any = [];
  unsubCurrentUser: any;
  unsubInput: any;


  constructor() {
    this.subInput();
  }

  ngOnInit(): void {
    this.unsubCurrentUser = this.currentUserService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
    this.currentUserService.activeUser();
  }

  ngOnDestroy(): void {
    this.unsubCurrentUser.unsubscribe();
    this.unsubInput.unsubscribe();
  }

  subInput() {
    this.unsubInput =
      this.input$.pipe(debounceTime(200)).subscribe(search => {
        if (search.length >= 2) {
          this.channelMessages = [];
          this.messagesIntoChannel();
          this.filteredUsers = this.filterUser(search);
          this.filteredChannel = this.filterChannel(search);
          console.log(this.channelMessages);

          this.filteredMessages = this.filterMessages(search);
          console.log(this.filteredMessages);

          if (this.filteredUsers.length >= 1 || this.filteredChannel.length >= 1) this.dropDownList = true; else this.dropDownList = false;
        } else {
          this.dropDownList = false;
          this.filteredUsers = [];
        }
      })
  }

  filterUser(search: string) {
    let filterUser = this.usersService.users.filter(((el: any) => el.name.toLowerCase().includes(search.toLowerCase())));
    filterUser = this.filterActiveUser(filterUser);
    return filterUser;
  }

  filterChannel(search: string) {
    let filterChannel = this.FirebaseService.channels.filter(((el: any) => el.name.toLowerCase().includes(search.toLowerCase())));
    return filterChannel;
  }

  filterMessages(search: string) {
    let filterMessages = this.channelMessages.filter(((el: any) => el.messages.content.toLowerCase().includes(search.toLowerCase())));
    return filterMessages;
  }

  filterActiveUser(filteredUser: any) {
    let index = filteredUser.findIndex((user: any) => user.id === this.currentUser.uid);
    if (index != -1) filteredUser.splice(index, 1);
    return filteredUser;
  }

  async messagesIntoChannel() {
    this.FirebaseService.channels.forEach(async (element) => {
      let channel = element;
      console.log(channel);
      let ref = await getDocs(collection(this.firestore, 'channels', element.id, 'messages'));
      ref.forEach((message: any) => {
        if (message) channel.messages.push(message.data());
      });
      this.channelMessages.push(channel);
      console.log(this.channelMessages);
    })
  }
}