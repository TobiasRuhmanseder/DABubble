import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CurrentUserService } from '../../../services/current-user.service';
import { UserPicComponent } from "../../user-pic/user-pic.component";
import { ActiveUser } from '../../../interfaces/active-user.interface';

@Component({
  selector: 'app-current-user-profile',
  standalone: true,
  templateUrl: './current-user-profile.component.html',
  styleUrl: './current-user-profile.component.scss',
  imports: [UserPicComponent]
})
export class CurrentUserProfileComponent {
  @Output() currentUserProfileClosed: EventEmitter<boolean> = new EventEmitter();
  @Input() activeUser!: ActiveUser;
  currentUserService: CurrentUserService = inject(CurrentUserService);
  currentUser: any;

  closeDialog() {
    this.currentUserProfileClosed.emit(false);
  }


}
