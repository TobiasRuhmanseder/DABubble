import { Component, Input, inject } from '@angular/core';
import { UserPicComponent } from '../../../user-pic/user-pic.component';
import { CurrentUserService } from '../../../../services/current-user.service';
import { Router } from '@angular/router';
import { DirectMessagesService } from '../../../../services/direct-messages.service';

CurrentUserService


@Component({
  selector: 'app-direct-message-user-list-element',
  standalone: true,
  imports: [UserPicComponent],
  templateUrl: './direct-message-user-list-element.component.html',
  styleUrl: './direct-message-user-list-element.component.scss'
})
export class DirectMessageUserListElementComponent {

  router: Router = inject(Router);
  diMeService: DirectMessagesService = inject(DirectMessagesService);
  @Input() userName!: String;
  @Input() userUid!: string;
  @Input() userPic!: String;
  @Input() status!: Boolean;


  async chooseId() {
    let directMessageDocId = await this.diMeService.getDocIdFromTheDirectMessaging(this.userUid)
    this.router.navigateByUrl('/home/' + directMessageDocId);
  }
}
