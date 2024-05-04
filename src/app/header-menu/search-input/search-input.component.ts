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
import { AllowedChannelsService } from '../../../services/allowed-channels.service';
import { Channel } from '../../../models/channel.class';
import { Message } from '../../../models/message.class';


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
  allowedChannelService: AllowedChannelsService = inject(AllowedChannelsService);
  router: Router = inject(Router);
  currentUser: any = [];
  unsubCurrentUser: any;
  unsubAllowedChannel: any;
  unsubInput: any;
  loadMessages = false;
  allowedChannels: any = [];


  ngOnInit(): void {
    this.unsubCurrentUser = this.subCurrentUser();
    this.unsubAllowedChannel = this.subAllowChannel();
    this.unsubInput = this.subInput();
  }

  ngOnDestroy(): void {
    this.unsubCurrentUser.unsubscribe();
    this.unsubInput.unsubscribe();
    this.unsubAllowedChannel.unsubscribe();
  }

  subCurrentUser() {
    return this.currentUserService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  subInput() {
    return this.input$.pipe(debounceTime(200)).subscribe(async search => {
      if (search.length >= 2) {
        this.clearAllArrays();
        this.filteredUsers = this.filterUser(search);
        this.filteredChannel = this.filterChannel(search);
        if (!this.loadMessages) await this.messagesIntoChannel();
        this.checkHits();
        this.filterMessages(search);
        this.checkHits();
      } else {
        this.dropDownList = false;
        this.clearAllArrays();
      }
    })
  }

  subAllowChannel() {
    return this.allowedChannelService.getAllowedChannels().subscribe(channels => {
      this.allowedChannels = this.allowedChannelService.getUsersWithParse(channels);
      if (!this.loadMessages) this.messagesIntoChannel();
    })
  }

  checkHits() {
    if (this.filteredUsers.length >= 1 || this.filteredChannel.length >= 1 || this.filteredMessages.length >= 1) this.dropDownList = true; else this.dropDownList = false;
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
    let filterChannel = this.allowedChannels.filter(((el: any) => el.name.toLowerCase().includes(search.toLowerCase())));
    return filterChannel;
  }

  filterMessages(search: string) {
    for (let i = 0; i < this.channelMessages.length; i++) {
      let filtered = this.channelMessages[i].messages.filter(((el: any) => el.message.toLowerCase().includes(search.toLowerCase())));
      for (let z = 0; z < filtered.length; z++) {
        this.filteredMessages.push({ message: filtered[z], channelname: this.channelMessages[i].name, channelId: this.channelMessages[i].id })
      }
    }
  }

  filterActiveUser(filteredUser: any) {
    let index = filteredUser.findIndex((user: any) => user.id === this.currentUser.uid);
    if (index != -1) filteredUser.splice(index, 1);
    return filteredUser;
  }
  async messagesIntoChannel() {
    this.loadMessages = true;
    console.log(this.allowedChannels);

    this.channelMessages = [];
    for (let i = 0; i < this.allowedChannels.length; i++) {
      let channel = new Channel(this.allowedChannels[i]);
      let ref = await getDocs(collection(this.firestore, 'channels', this.allowedChannels[i].id, 'messages'));
      ref.forEach((element: any) => {
        let ref = new Message(element.data());
        let messages = [
          {
            id: ref.id,
            message: ref.content
          }
        ];
        channel.messages.push(messages[0]);
      });
      this.channelMessages.push(channel);
    }
    this.loadMessages = false;
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

