import { Component, Inject, OnDestroy, OnInit, inject } from '@angular/core';
import { IconHoverChangeImageComponent } from '../../icon-hover-change-image/icon-hover-change-image.component';
import { ChannelListElementComponent } from './channel-list-element/channel-list-element.component';
import { FirebaseService } from '../../../services/firebase.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-channel-view',
  standalone: true,
  imports: [IconHoverChangeImageComponent, ChannelListElementComponent, CommonModule],
  templateUrl: './channel-view.component.html',
  styleUrl: './channel-view.component.scss'
})
export class ChannelViewComponent implements OnDestroy, OnInit {
  dropdownOpen = true;
  firebaseService: FirebaseService = inject(FirebaseService);
  activeRoute: ActivatedRoute = inject(ActivatedRoute);
  currentCollectionId = '';
  unsubParams: any;

  ngOnInit(): void {
    this.unsubParams = this.activeRoute.params.subscribe(params => {
      this.currentCollectionId = params['id'];
    });
  }


  ngOnDestroy(): void {
    this.unsubParams.unsubscribe();
  }

  toggleDropdownMenu() {
    this.dropdownOpen = !this.dropdownOpen;
  }
}
