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
import { DirectMessagesService } from '../../../services/direct-messages.service';
import { Router } from '@angular/router';
import { IdToScrollService } from '../../../services/id-to-scroll.service';

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
  diMeService: DirectMessagesService = inject(DirectMessagesService);
  idToScrollService: IdToScrollService = inject(IdToScrollService);
  router: Router = inject(Router);
  currentUser: any = [];
  unsubCurrentUser: any;
  unsubInput: any;
  loadMessages = false;
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
      this.input$.pipe(debounceTime(200)).subscribe(async search => {
        this.clearAllArrays();
        if (search.length >= 2) {
          this.filteredUsers = this.filterUser(search);
          this.filteredChannel = this.filterChannel(search);
          if (!this.loadMessages) await this.messagesIntoChannel();
          this.filterMessages(search);
          if (this.filteredUsers.length >= 1 || this.filteredChannel.length >= 1 || this.filteredMessages.length >= 1) this.dropDownList = true; else this.dropDownList = false;
        } else {
          this.dropDownList = false;
          this.clearAllArrays();
        }
      })
  }

  clearAllArrays() {
    this.filteredMessages = [];
    this.filteredUsers = [];
    this.filteredChannel = [];
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
    for (let i = 0; i < this.channelMessages.length; i++) {
      for (let x = 0; x < this.channelMessages[i].messages.length; x++) {
      }

      let filtered = this.channelMessages[i].messages.filter(((el: any) => el.message.toLowerCase().includes(search.toLowerCase())));
      for (let z = 0; z < filtered.length; z++) {
        this.filteredMessages.push({ message: filtered[z], channelname: this.channelMessages[i].name, channelId: this.channelMessages[i].id })
      }
    }
    console.log(this.filteredMessages);

  }

  filterActiveUser(filteredUser: any) {
    let index = filteredUser.findIndex((user: any) => user.id === this.currentUser.uid);
    if (index != -1) filteredUser.splice(index, 1);
    return filteredUser;
  }

  async messagesIntoChannel() {
    this.loadMessages = true;
    this.channelMessages = [];
    for (let i = 0; i < this.FirebaseService.channels.length; i++) {
      let channel: any = [];
      channel.push(this.FirebaseService.channels[i]);

      let ref = await getDocs(collection(this.firestore, 'channels', this.FirebaseService.channels[i].id, 'messages'));
      ref.forEach((element: any) => {
        let ref = element.data();
        let messages = [
          {
            id: ref.id,
            message: ref.content
          }
        ];
        channel[0].messages.push(messages[0]);

      });
      this.channelMessages.push(channel[0]);
      console.log(this.channelMessages);
    }
  }

  clearInput() {
    this.inputValue = '';
    this.dropDownList = false;
  }

  async onClickUser(userUid: string) {
    if (userUid != undefined) {
      let directMessageDocId = await this.diMeService.getDocIdFromTheDirectMessaging(userUid);
      this.router.navigateByUrl('/home/' + directMessageDocId);
      this.clearInput();
    }
  }

  onClickChannel(channelId: string) {
    this.router.navigateByUrl('/home/' + channelId);
    this.clearInput();
  }

  onClickMessage(channel: any) {
    this.router.navigateByUrl('/home/' + channel.channelId);
    this.idToScrollService.addId(channel.message.id);
    this.clearInput();
  }
}

