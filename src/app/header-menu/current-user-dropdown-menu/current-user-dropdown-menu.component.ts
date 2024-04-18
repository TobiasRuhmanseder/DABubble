import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CurrentUserService } from '../../../services/current-user.service';


@Component({
  selector: 'app-current-user-dropdown-menu',
  standalone: true,
  imports: [],
  templateUrl: './current-user-dropdown-menu.component.html',
  styleUrl: './current-user-dropdown-menu.component.scss'
})
export class CurrentUserDropdownMenuComponent {
  @Output() dropDownMenuClosed: EventEmitter<boolean> = new EventEmitter();
  currentUserService: CurrentUserService = inject(CurrentUserService);

  closeDialog() {
    this.dropDownMenuClosed.emit(false);
  }

  signOutUser() {
    this.currentUserService.signOut();
  }
}
