import { Component, Input } from '@angular/core';
import { Channel } from '../../../../models/channel.class';
import { CommonModule } from '@angular/common';
import { ChannelViewComponent } from '../channel-view.component';


@Component({
  selector: 'app-channel-list-element',
  standalone: true,
  imports: [CommonModule,ChannelViewComponent ],
  templateUrl: './channel-list-element.component.html',
  styleUrl: './channel-list-element.component.scss'
})
export class ChannelListElementComponent {

  @Input() channel:any;
}
