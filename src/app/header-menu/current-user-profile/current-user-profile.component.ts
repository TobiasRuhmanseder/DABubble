import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CurrentUserService } from '../../../services/current-user.service';

@Component({
  selector: 'app-current-user-profile',
  standalone: true,
  imports: [],
  templateUrl: './current-user-profile.component.html',
  styleUrl: './current-user-profile.component.scss'
})
export class CurrentUserProfileComponent {
  @Output() currentUserProfileClosed: EventEmitter<boolean> = new EventEmitter();
  currentUserService: CurrentUserService = inject(CurrentUserService);

  closeDialog() {
    this.currentUserProfileClosed.emit(false);
  }
}
