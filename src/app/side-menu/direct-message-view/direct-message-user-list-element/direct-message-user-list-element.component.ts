import { Component, Input, inject } from '@angular/core';
import { UserPicComponent } from '../../../user-pic/user-pic.component';
import { CurrentUserService } from '../../../../services/current-user.service';
import { ActiveUser } from '../../../../interfaces/active-user.interface';
CurrentUserService


@Component({
  selector: 'app-direct-message-user-list-element',
  standalone: true,
  imports: [UserPicComponent],
  templateUrl: './direct-message-user-list-element.component.html',
  styleUrl: './direct-message-user-list-element.component.scss'
})
export class DirectMessageUserListElementComponent {
  @Input() userName!: String;
  @Input() userPic!: String;
  @Input() status!: Boolean;

}
