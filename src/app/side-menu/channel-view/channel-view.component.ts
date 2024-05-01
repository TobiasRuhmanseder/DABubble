import { Component, Inject, OnDestroy, OnInit, inject } from '@angular/core';
import { IconHoverChangeImageComponent } from '../../icon-hover-change-image/icon-hover-change-image.component';
import { ChannelListElementComponent } from './channel-list-element/channel-list-element.component';
import { NewChannelListElementComponent } from './new-channel-list-element/new-channel-list-element.component';
import { FirebaseService } from '../../../services/firebase.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogNewChannelComponent } from '../dialog-new-channel/dialog-new-channel.component';
import { CurrentUserService } from '../../../services/current-user.service';
import { ActiveUser } from '../../../interfaces/active-user.interface';
import { UsersService } from '../../../services/users.service';
import { Channel } from '../../../models/channel.class';


@Component({
  selector: 'app-channel-view',
  standalone: true,
  imports: [IconHoverChangeImageComponent, ChannelListElementComponent, CommonModule, NewChannelListElementComponent],
  templateUrl: './channel-view.component.html',
  styleUrl: './channel-view.component.scss'
})
export class ChannelViewComponent implements OnDestroy, OnInit {
  dropdownOpen = true;
  firebaseService: FirebaseService = inject(FirebaseService);
  activeRoute: ActivatedRoute = inject(ActivatedRoute);
  currentUserService: CurrentUserService = inject(CurrentUserService);
  usersService: UsersService = inject(UsersService);
  currentCollectionId = '';
  allowedChannels: any[] = [];
  channels: any;
  unsubParams: any;
  unsubChannels: any;
  unsubCurrentUser: any;
  unsubUsers: any;
  dialog: MatDialog = inject(MatDialog);
  activeUser: any;
  activeUserId: string = '';
  users: any;


  ngOnInit(): void {
    this.users = this.usersService.users;
    this.unsubCurrentUser = this.subCurrentUser();
    this.currentUserService.activeUser();
    this.unsubParams = this.subParam();
    this.unsubChannels = this.subChannels();
    this.unsubUsers = this.subUsers();
  }

  loadAllowedChannel() {
    this.getAllowedChannels(this.firebaseService.channels);

  }

  subChannels() {
    return this.firebaseService.$channels.subscribe(channels => {
      this.getAllowedChannels(channels);
      this.loadAllowedChannel();
    })
  }

  subParam() {
    return this.activeRoute.params.subscribe(params => {
      this.currentCollectionId = params['id'];
      this.loadAllowedChannel();
    });
  }

  subCurrentUser() {
    return this.currentUserService.currentUser.subscribe(user => {
      let currentUser;
      currentUser = this.setActiceUser(user);
      this.activeUser = currentUser;
      this.getCurrentUserId();
      this.loadAllowedChannel();
    });
  }

  subUsers() {
    return this.usersService.users$.subscribe((users: any) => {
      this.users = users;
      this.loadAllowedChannel();
    })
  }

  setActiceUser(user: any): ActiveUser {
    let activeUser = user;
    if (activeUser == null) {
      activeUser = {
        displayName: "noUser",
        photoURL: "male1.svg",
        email: ""
      }
    }
    else {
      activeUser = {
        displayName: user.displayName,
        photoURL: user.photoURL,
        email: user.email
      }
    }
    return activeUser;
  }

  getCurrentUserId() {
    this.users.forEach((user: any) => {
      if (user.email === this.activeUser.email) this.activeUserId = user.id;
    });
  }

  openDialog() {
    this.dialog.open(DialogNewChannelComponent);
  }

  ngOnDestroy(): void {
    this.unsubParams.unsubscribe();
    this.unsubChannels.unsubscribe();
    this.unsubCurrentUser.unsubscribe();
    this.unsubUsers.unsubscribe();
  }

  toggleDropdownMenu() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  getAllowedChannels(channels: any) {
    this.allowedChannels = [];
    channels.forEach((channel: any) => {

      if (channel.users.length === 0) this.allowedChannels.push(channel);
      else if (channel.users.includes(this.activeUserId)) {
        let channelWithUserArray = new Channel(channel);
        let users = channel.users;
        let usersArr = [];
        if (typeof users === 'string') usersArr= JSON.parse(users);
        channelWithUserArray.users = usersArr;
        this.allowedChannels.push(channelWithUserArray);
      }
    });
  }
}
