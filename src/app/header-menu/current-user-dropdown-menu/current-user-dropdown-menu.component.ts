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

  constructor() {

  }

  closeDialog() {
    this.dropDownMenuClosed.emit(false);
  }

  mobileCloseDialog() {
    this.unsubInterval = this.subInterval();
  }

  userProfilOpen() {
    this.userProfileIsOpen = true;
    this.slideOut = true;
  }

  subInterval() {
    this.slideOut = true;
    return this.intervalClose.pipe(timeInterval(), take(1)).subscribe(() => {
      this.closeDialog();
    }
    )
  }

  closeUserProfil(event: boolean) {
    this.userProfileIsOpen = event;
    this.slideOut = event;
  }

  signOutUser() {
    this.currentUserService.signOut();
  }


}
