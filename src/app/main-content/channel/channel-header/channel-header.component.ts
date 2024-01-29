import { Component } from '@angular/core';
import { UserPicComponent } from '../../../user-pic/user-pic.component';

@Component({
  selector: 'app-channel-header',
  standalone: true,
  imports: [
    UserPicComponent
  ],
  templateUrl: './channel-header.component.html',
  styleUrl: './channel-header.component.scss'
})
export class ChannelHeaderComponent {

}
