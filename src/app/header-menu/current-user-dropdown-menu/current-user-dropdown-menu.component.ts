import { Component, EventEmitter, Input, OnDestroy, Output, inject } from '@angular/core';
import { CurrentUserService } from '../../../services/current-user.service';
import { CurrentUserProfileComponent } from '../current-user-profile/current-user-profile.component';
import { CommonModule } from '@angular/common';
import { ActiveUser } from '../../../interfaces/active-user.interface';
import { Observable, Subscription, interval, take, timeInterval } from 'rxjs';


@Component({
  selector: 'app-current-user-dropdown-menu',
  standalone: true,
  imports: [CurrentUserProfileComponent, CommonModule],
  templateUrl: './current-user-dropdown-menu.component.html',
  styleUrl: './current-user-dropdown-menu.component.scss'
})
export class CurrentUserDropdownMenuComponent {
  @Output() dropDownMenuClosed: EventEmitter<boolean> = new EventEmitter();
  @Input() activeUser!: ActiveUser;
  currentUserService: CurrentUserService = inject(CurrentUserService);
  userProfileIsOpen = false;
  intervalClose = interval(350);
  unsubInterval: any;
  slideOut = false;

  /**
   * close the dropdown menu from the current user 
   */
  closeDialog() {
    this.dropDownMenuClosed.emit(false);
  }

  /**
   * close or slidedown the mobile menu on the bottom - starts a rxjs interval to show the slide down
   */
  mobileCloseDialog() {
    this.unsubInterval = this.subInterval();
  }

  /**
   * open the current user profil
   */
  userProfilOpen() {
    this.userProfileIsOpen = true;
    this.slideOut = true;
  }

  /**
   * 
   * @returns return the rxjs interval 
   */
  subInterval() {
    this.slideOut = true;
    return this.intervalClose.pipe(timeInterval(), take(1)).subscribe(() => {
      this.closeDialog();
    }
    )
  }

  /**
   * close the current user profil and slinde in the dropup menu in the mobile and tablet view
   * 
   * @param event toggle with boolean
   */
  closeUserProfil(event: boolean) {
    this.userProfileIsOpen = event;
    this.slideOut = event;
  }

  /**
   * current user logout - and goes back to the start screen / login screen
   */
  signOutUser() {
    this.currentUserService.signOut();
  }


}
