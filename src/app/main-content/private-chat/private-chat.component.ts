import { Component } from '@angular/core';
import { UserPicComponent } from '../../user-pic/user-pic.component';
import { MainContentFooterComponent } from '../main-contents/main-content-footer/main-content-footer.component';
import { DialogUserInfoComponent } from './dialog-user-info/dialog-user-info.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-private-chat',
  standalone: true,
  imports: [
    UserPicComponent,
    MainContentFooterComponent

  ],
  templateUrl: './private-chat.component.html',
  styleUrl: './private-chat.component.scss'
})
export class PrivateChatComponent {


  constructor(public dialog: MatDialog) {

  }


  openUserDetails() {
    this.dialog.open(DialogUserInfoComponent, {});
  }
}
