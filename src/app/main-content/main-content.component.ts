import { Component } from '@angular/core';
import { ChannelComponent } from './channel/channel.component';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [
    ChannelComponent
  ],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss'
})
export class MainContentComponent {

}
