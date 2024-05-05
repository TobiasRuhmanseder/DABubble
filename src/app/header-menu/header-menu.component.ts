import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { UserPicComponent } from '../user-pic/user-pic.component';
import { CurrentUserService } from '../../services/current-user.service';
import { ActiveUser } from '../../interfaces/active-user.interface';
import { CurrentUserDropdownMenuComponent } from './current-user-dropdown-menu/current-user-dropdown-menu.component';
import { CommonModule } from '@angular/common';
import { SearchInputComponent } from './search-input/search-input.component';


@Component({
  selector: 'app-header-menu',
  standalone: true,
  imports: [UserPicComponent, CurrentUserDropdownMenuComponent, CommonModule, SearchInputComponent],
  templateUrl: './header-menu.component.html',
  styleUrl: './header-menu.component.scss'
})
export class HeaderMenuComponent implements OnInit, OnDestroy {

  currentUserService: CurrentUserService = inject(CurrentUserService);
  activeUser: ActiveUser = { displayName: "", photoURL: "", email: "" };
  unsubCurrentUser: any;
  drownDownMenuOpen = false;

  ngOnInit(): void {
    this.unsubCurrentUser = this.subCurrentUser();
    this.currentUserService.activeUser();
  }
  /**
   * 
   * @returns return the subscribe for the current user - the subject can be found in current-user.service
   */
  subCurrentUser() {
    return this.currentUserService.currentUser.subscribe(user => {
      let currentUser;
      currentUser = this.setActiceUser(user);
      this.activeUser = currentUser;
    });
  }

  ngOnDestroy(): void {
    this.unsubCurrentUser.unsubscribe();
  }

  /**
   * 
   * @param user logged in user
   * @returns returns the logged in user in a ActiveUser object
   */
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

}

