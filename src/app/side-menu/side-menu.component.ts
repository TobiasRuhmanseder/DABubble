import { Component } from '@angular/core';
import { ChannelViewComponent } from './channel-view/channel-view.component';
import { IconHoverChangeImageComponent } from '../icon-hover-change-image/icon-hover-change-image.component';
import { DirectMessageViewComponent } from './direct-message-view/direct-message-view.component';



@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [ChannelViewComponent, IconHoverChangeImageComponent, DirectMessageViewComponent],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss'
})
export class SideMenuComponent {

  menuOpen = true;

  toggle(){
this.menuOpen = !this.menuOpen;
  }
}
