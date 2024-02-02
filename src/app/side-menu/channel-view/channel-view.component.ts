import { Component, Inject, OnInit, inject} from '@angular/core';
import { IconHoverChangeImageComponent } from '../../icon-hover-change-image/icon-hover-change-image.component';
import { ChannelListElementComponent } from './channel-list-element/channel-list-element.component';
import { FirebaseService } from '../../../services/firebase.service';
import { CommonModule } from '@angular/common';




@Component({
  selector: 'app-channel-view',
  standalone: true,
  imports: [IconHoverChangeImageComponent, ChannelListElementComponent, CommonModule],
  templateUrl: './channel-view.component.html',
  styleUrl: './channel-view.component.scss'
})
export class ChannelViewComponent implements OnInit {
  dropdownOpen = true;

  constructor(public firebaseService: FirebaseService){

  }
ngOnInit(): void {

}

  toggleDropdownMenu(){
    this.dropdownOpen = !this.dropdownOpen;
  }
}
