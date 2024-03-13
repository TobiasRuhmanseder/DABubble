import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsersService } from '../../../../services/users.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog-user-info',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './dialog-user-info.component.html',
  styleUrl: './dialog-user-info.component.scss',
})
export class DialogUserInfoComponent {
  userData: any;

  constructor(
    public users: UsersService,
    public dialogRef: MatDialogRef<DialogUserInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.userData = this.users.getUserFromId(data.id);
  }

  sendEmail(email: string) {
    window.open('mailto:' + email);
  }

  goToPrivateChannel(): void {
    this.onNoClick();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
