import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialogModule,
} from '@angular/material/dialog';
import { UsersService } from '../../../../services/users.service';

@Component({
  selector: 'app-channel-pop-up',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,

  ],
  templateUrl: './channel-pop-up.component.html',
  styleUrl: './channel-pop-up.component.scss'
})
export class ChannelPopUpComponent {
channelData:any;
  constructor(
    public users: UsersService,
    public dialogRef: MatDialogRef<ChannelPopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any
  ) { 
    this.channelData = this.data.channel
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
