import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChannelViewComponent } from '../channel-view.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-channel-list-element',
  standalone: true,
  imports: [CommonModule, ChannelViewComponent],
  templateUrl: './channel-list-element.component.html',
  styleUrl: './channel-list-element.component.scss'
})
export class ChannelListElementComponent {

  @Input() channel: any;
  @Input() currentCollectionId = '';

  router: Router = inject(Router);


  chooseChannel() {
    this.router.navigateByUrl('/home/' + this.channel.id);
  }

}
