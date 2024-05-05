import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { IconHoverChangeImageComponent } from '../../icon-hover-change-image/icon-hover-change-image.component';
import { ChannelListElementComponent } from './channel-list-element/channel-list-element.component';
import { NewChannelListElementComponent } from './new-channel-list-element/new-channel-list-element.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogNewChannelComponent } from '../dialog-new-channel/dialog-new-channel.component';
import { Channel } from '../../../models/channel.class';
import { AllowedChannelsService } from '../../../services/allowed-channels.service';

@Component({
  selector: 'app-channel-view',
  standalone: true,
  imports: [IconHoverChangeImageComponent, ChannelListElementComponent, CommonModule, NewChannelListElementComponent],
  templateUrl: './channel-view.component.html',
  styleUrl: './channel-view.component.scss',
  providers: [ChannelViewComponent]
})
export class ChannelViewComponent implements OnDestroy, OnInit {
  dropdownOpen = true;
  activeRoute: ActivatedRoute = inject(ActivatedRoute);
  allowedChannelService: AllowedChannelsService = inject(AllowedChannelsService);
  currentCollectionId = '';
  allowedChannels: any[] = [];
  unsubParams: any;;
  unsubAllowedChannel: any;
  dialog: MatDialog = inject(MatDialog);
  activeUserId: string = '';

  ngOnInit(): void {
    this.unsubParams = this.subParam();
    this.unsubAllowedChannel = this.subAllowChannel();
  }

  ngOnDestroy(): void {
    this.unsubAllowedChannel.unsubscribe();
  }

  /**
   * 
   * @returns return the subscribe for allowed channel - the subject can be found in allowed-channel.service
   */
  subAllowChannel() {
    return this.allowedChannelService.getAllowedChannels().subscribe(channels => {
      this.allowedChannels = this.allowedChannelService.getUsersWithParse(channels);
    })
  }

  /**
   * 
   * @returns return the subscribe for the params 
   */
  subParam() {
    return this.activeRoute.params.subscribe(params => {
      this.currentCollectionId = params['id'];
    });
  }

  /**
   * open the new channel dialog
   */
  openDialog() {
    this.dialog.open(DialogNewChannelComponent);
  }

  /**
   * toggle the dropdown menu
   */
  toggleDropdownMenu() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  /**
   * filters based on channel.users whether the logged in user with the id can be found there. 
   * If channel.users is empty, then it is a public and therefore authorized channel
   * 
   * @param channels channels
   * @returns return the allowed channel for the logged in user
   */
  getAllowedChannels(channels: any) {
    let allowedChannels: any = [];
    channels.forEach((channel: any) => {
      if (channel.users.length === 0) allowedChannels.push(channel);
      else if (channel.users.includes(this.activeUserId)) {
        let channelWithUserArray = new Channel(channel);
        let users = channel.users;
        let usersArr = [];
        if (typeof users === 'string') usersArr = JSON.parse(users);
        channelWithUserArray.users = usersArr;
        allowedChannels.push(channelWithUserArray);
      }
    });
    return allowedChannels;
  }
}
