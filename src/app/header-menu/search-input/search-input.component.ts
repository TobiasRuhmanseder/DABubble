import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { UserPicComponent } from '../../user-pic/user-pic.component';
import { Subject, debounceTime } from 'rxjs';
import { UsersService } from '../../../services/users.service';
import { ChannelService } from '../../../services/channel.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrentUserService } from '../../../services/current-user.service';




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

  input$ = new Subject<string>();
  dropDownList = false;
  inputValue: any;

  usersService: UsersService = inject(UsersService);
  channelService: ChannelService = inject(ChannelService);
  currentUserService: CurrentUserService = inject(CurrentUserService);
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
          this.filteredUsers = this.filterUser(search);
          this.filteredUsers = this.filterActiveUser(this.filteredUsers);
          if (this.filteredUsers.length >= 1) this.dropDownList = true; else this.dropDownList = false;
        } else {
          this.dropDownList = false;
          this.filteredUsers = [];
        }
      })
  }

  filterUser(search: string) {
    const filterUser = this.usersService.users.filter(((el: any) => el.name.toLowerCase().includes(search.toLowerCase())));
    return filterUser;
  }

  filterActiveUser(filteredUser: any) {
    let index = filteredUser.findIndex((user: any) => user.id === this.currentUser.uid);
    if (index != -1) filteredUser.splice(index, 1);
    return filteredUser;
  }
}
