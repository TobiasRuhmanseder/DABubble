import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CurrentUserService } from '../../../services/current-user.service';
import { UserPicComponent } from "../../user-pic/user-pic.component";
import { ActiveUser } from '../../../interfaces/active-user.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-current-user-profile',
  standalone: true,
  templateUrl: './current-user-profile.component.html',
  styleUrl: './current-user-profile.component.scss',
  imports: [UserPicComponent, CommonModule, FormsModule]
})
export class CurrentUserProfileComponent {
  @Output() currentUserProfileClosed: EventEmitter<boolean> = new EventEmitter();
  @Input() activeUser!: ActiveUser;
  currentUserService: CurrentUserService = inject(CurrentUserService);
  currentUser: any;
  editCurrentUser = false;

  /**
   * close the current user dialog
   */
  closeDialog() {
    this.currentUserProfileClosed.emit(false);
  }

  /**
   *  open editable area by the logged in user 
   */
  editButtonCurrentUser() {
    this.editCurrentUser = true;
  }

  /**
   * close editable area by the logged in user
   */
  closeEdit() {
    this.editCurrentUser = false;
  }

  /**
   * The dialog doesn't close when you click on it because this happens when you click on the background
   * 
   * @param event stop the click event
   */
  doNotClose(event: any) {
    event.stopPropagation();
  }

  /**
   * saves the new data entered by the logged in user
   */
  saveEdit() {
    const userName = this.activeUser.displayName;
    const userEmail = this.activeUser.email;
    this.currentUserService.editUserDetails(userName, userEmail);
    this.closeEdit();
  }
}
