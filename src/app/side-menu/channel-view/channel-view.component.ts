import { Component, Inject, OnInit, inject} from '@angular/core';
import { IconHoverChangeImageComponent } from '../../icon-hover-change-image/icon-hover-change-image.component';
import { ChannelListElementComponent } from './channel-list-element/channel-list-element.component';
import { FirebaseService } from '../../../services/firebase.service';



@Component({
  selector: 'app-channel-view',
  standalone: true,
  imports: [IconHoverChangeImageComponent, ChannelListElementComponent],
  templateUrl: './channel-view.component.html',
  styleUrl: './channel-view.component.scss'
})
export class ChannelViewComponent implements OnInit {
  dropdownOpen = true;
  firebase = Inject(FirebaseService);

  constructor(){

  }
ngOnInit(): void {
 console.log(this.firebase.channels)
}

  toggleDropdownMenu(){
    this.dropdownOpen = !this.dropdownOpen;
  }
}
