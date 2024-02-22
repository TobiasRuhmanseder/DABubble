import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { IconHoverChangeImageComponent } from '../../icon-hover-change-image/icon-hover-change-image.component';
import { DirectMessageUserListElementComponent } from './direct-message-user-list-element/direct-message-user-list-element.component';
import { ActiveUser } from '../../../interfaces/active-user.interface';
import { CurrentUserService } from '../../../services/current-user.service';
import { UsersService } from '../../../services/users.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-direct-message-view',
  standalone: true,
  imports: [IconHoverChangeImageComponent, DirectMessageUserListElementComponent, CommonModule],
  templateUrl: './direct-message-view.component.html',
  styleUrl: './direct-message-view.component.scss'
})
export class DirectMessageViewComponent implements OnInit, OnDestroy {
  dropdownOpen = true;
  activeUser: ActiveUser = { displayName: "", photoURL: "" };
  allUsersWithoutActiveUser: any[] = [];

  unsubCurrentUser: any;
  unsubAllUsers: any;

  currentUserService: CurrentUserService = inject(CurrentUserService);
  userService: UsersService = inject(UsersService);


  ngOnInit(): void {
    this.currentUserService.activeUser();
    this.unsubAllUsers = this.subAllUsers();
    this.unsubCurrentUser = this.subCurrentUser();
    if (this.userService) this.userService.subUsers();
  }

  ngOnDestroy(): void {
    this.unsubCurrentUser.unsubscribe();
    this.userService.unsubUsers();
  }

  toggleDropdownMenu() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  setActiceUser(user: any): ActiveUser {
    let activeUser = user;
    if (activeUser == null) {
      activeUser = {
        displayName: "",
        photoURL: ""
      }
    }
    else {
      activeUser = {
        displayName: user.displayName,
        photoURL: user.photoURL
      }
    }
    return activeUser;
  }

  subCurrentUser() {
    return this.currentUserService.currentUser.subscribe(user => {
      let currentUser;
      currentUser = this.setActiceUser(user);
      this.activeUser = currentUser;

    });
  }

  subAllUsers() {
    return this.userService.users$.subscribe((obj: any[]) => {
      let users: any = [];
      obj.forEach(element => {
        users.push(element);
      });
      this.allUsersWithoutActiveUser = this.withoutActiveUser(users);
    });
  }

  withoutActiveUser(users: any[]) {
    let index;
    let indexGuest;
    let withoutActiveUser = users;
    if (withoutActiveUser && this.activeUser) {
      index = withoutActiveUser.findIndex((user) => user.name === this.activeUser.displayName);
      if (index != -1) withoutActiveUser.splice(index, 1);
      indexGuest = withoutActiveUser.findIndex((user) => user.name === "Guest User");
      if (index != -1) withoutActiveUser.splice(indexGuest, 1);
    }
    return withoutActiveUser;
  }

}
