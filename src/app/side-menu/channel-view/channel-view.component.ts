import { Component } from '@angular/core';
import { IconHoverChangeImageComponent } from '../../icon-hover-change-image/icon-hover-change-image.component';

@Component({
  selector: 'app-channel-view',
  standalone: true,
  imports: [IconHoverChangeImageComponent],
  templateUrl: './channel-view.component.html',
  styleUrl: './channel-view.component.scss'
})
export class ChannelViewComponent {
  dropdownOpen = true;

  toggleDropdownMenu(){
    this.dropdownOpen = !this.dropdownOpen;
  }
}
