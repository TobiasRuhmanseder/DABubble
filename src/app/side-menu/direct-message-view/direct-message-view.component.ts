import { Component, inject } from '@angular/core';
import { IconHoverChangeImageComponent } from '../../icon-hover-change-image/icon-hover-change-image.component';

@Component({
  selector: 'app-direct-message-view',
  standalone: true,
  imports: [IconHoverChangeImageComponent],
  templateUrl: './direct-message-view.component.html',
  styleUrl: './direct-message-view.component.scss'
})
export class DirectMessageViewComponent {
  dropdownOpen = true;


  toggleDropdownMenu() {
    this.dropdownOpen = !this.dropdownOpen;
  }
}
