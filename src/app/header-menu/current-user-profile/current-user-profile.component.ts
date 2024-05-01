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

  closeDialog() {
    this.currentUserProfileClosed.emit(false);
  }

  editButtonCurrentUser() {
    this.editCurrentUser = true;
  }

  closeEdit() {
    this.editCurrentUser = false;
  }

  saveEdit() {
    const userName = this.activeUser.displayName;
    const userEmail = this.activeUser.email;
    this.currentUserService.editUserDetails(userName, userEmail);
    setTimeout(() => {
      this.closeEdit();
    }, 1000); 
  }
}
