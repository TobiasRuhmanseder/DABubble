import { Component } from '@angular/core';
import { ChannelViewComponent } from './channel-view/channel-view.component';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [ChannelViewComponent],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss'
})
export class SideMenuComponent {

}
