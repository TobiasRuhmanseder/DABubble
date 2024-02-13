import { Component } from '@angular/core';
import { UserPicComponent } from '../../../user-pic/user-pic.component';
import { ChannelPopUpComponent } from '../channel-pop-up/channel-pop-up.component';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from '../../../../services/message.service';
import { IconHoverChangeImageComponent } from "../../../icon-hover-change-image/icon-hover-change-image.component";

@Component({
    selector: 'app-channel-header',
    standalone: true,
    templateUrl: './channel-header.component.html',
    styleUrl: './channel-header.component.scss',
    imports: [
        UserPicComponent,
        IconHoverChangeImageComponent
    ]
})
export class ChannelHeaderComponent {


  constructor(public dialog: MatDialog, public chatService: MessageService) {

  }

  openDialog() {
    this.dialog.open(ChannelPopUpComponent, {});
  }
}
