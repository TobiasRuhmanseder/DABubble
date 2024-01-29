import { Component } from '@angular/core';
import { ChannelHeaderComponent } from './channel-header/channel-header.component';
import { ChannelChannelMessageComponent } from './channel-message/channel-channel-message.component';
import { ChannelInputComponent } from './channel-input/channel-input.component';

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [
    ChannelHeaderComponent,
    ChannelChannelMessageComponent,
    ChannelInputComponent
  ],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss'
})
export class ChannelComponent {

}
