import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogNewChannelComponent } from '../../dialog-new-channel/dialog-new-channel.component';

@Component({
  selector: 'app-new-channel-list-element',
  standalone: true,
  imports: [],
  templateUrl: './new-channel-list-element.component.html',
  styleUrl: './new-channel-list-element.component.scss'
})
export class NewChannelListElementComponent {

  dialog: MatDialog = inject(MatDialog);

  /**
   * open the dialog new Channel
   */
  openDialog() {
    this.dialog.open(DialogNewChannelComponent);
  }
}
