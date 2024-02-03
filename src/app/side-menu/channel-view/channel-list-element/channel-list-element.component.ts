import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { Channel } from '../../../../models/channel.class';
import { CommonModule } from '@angular/common';
import { ChannelViewComponent } from '../channel-view.component';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-channel-list-element',
  standalone: true,
  imports: [CommonModule, ChannelViewComponent,],
  templateUrl: './channel-list-element.component.html',
  styleUrl: './channel-list-element.component.scss'
})
export class ChannelListElementComponent implements OnInit, OnDestroy {

  @Input() channel: any;
  active = false;

  router: Router = inject(Router);
  activeRoute: ActivatedRoute = inject(ActivatedRoute);

  unsubParams: any;

  ngOnInit(): void {
    this.unsubParams = this.activeRoute.params.subscribe(params => {
      if (this.channel.id == params['id']) this.active = true;
      else this.active = false;
      console.log('change');
    });
  }

  ngOnDestroy(): void {
    this.unsubParams.unsubscribe();
  }

  chooseChannel() {
    this.router.navigateByUrl('/home/' + this.channel.id);

  }

}
