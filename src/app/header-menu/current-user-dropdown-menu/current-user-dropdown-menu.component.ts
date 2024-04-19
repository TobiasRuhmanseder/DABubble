import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CurrentUserService } from '../../../services/current-user.service';
import { CurrentUserProfileComponent } from '../current-user-profile/current-user-profile.component';
import { CommonModule } from '@angular/common';
import { ActiveUser } from '../../../interfaces/active-user.interface';


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
  userProfileOpen = false;

  closeDialog() {
    this.dropDownMenuClosed.emit(false);
  }

  signOutUser() {
    this.currentUserService.signOut();
  }
}
