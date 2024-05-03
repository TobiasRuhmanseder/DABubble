import { Injectable, inject } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { CurrentUserService } from './current-user.service';
import { Observable, map, switchMap } from 'rxjs';
import { Channel } from '../models/channel.class';


@Injectable({
  providedIn: 'root'
})
export class AllowedChannelsService {

  firebaseService: FirebaseService = inject(FirebaseService);
  currentUserService: CurrentUserService = inject(CurrentUserService);

  constructor() { }

  getAllowedChannels(): Observable<any> {
    return this.currentUserService.currentUser.pipe(
      switchMap(user => {
        return this.firebaseService.$channels.pipe(
          map((channels: any) => channels.filter((channel: any) => channel.users.includes(user.uid) || channel.users.length == 0))
        );
      })
    );
  }

  getUsersWithParse(channels: any) {
    let parsedUserChannels: any = [];
    channels.forEach((channel: any) => {
      let parsedChannel = new Channel(channel);
      if (parsedChannel.users.length > 0) {
        let users = channel.users;
        let usersArr = JSON.parse(users);
        parsedChannel.users = usersArr;
      }
      parsedUserChannels.push(parsedChannel);
    });
    return parsedUserChannels;
  }
}
