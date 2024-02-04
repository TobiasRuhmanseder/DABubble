import { Component } from '@angular/core';
import { UserPicComponent } from '../../user-pic/user-pic.component';
import { MainContentFooterComponent } from '../main-contents/main-content-footer/main-content-footer.component';

@Component({
  selector: 'app-private-chat',
  standalone: true,
  imports: [
    UserPicComponent,
    MainContentFooterComponent

  ],
  templateUrl: './private-chat.component.html',
  styleUrl: './private-chat.component.scss'
})
export class PrivateChatComponent {

}
