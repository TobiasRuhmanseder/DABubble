import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-user-info',
  standalone: true,
  imports: [
    MatButtonModule
  ],
  templateUrl: './dialog-user-info.component.html',
  styleUrl: './dialog-user-info.component.scss'
})
export class DialogUserInfoComponent {



  
  constructor(
    public dialogRef: MatDialogRef<DialogUserInfoComponent>,
  ) { }

  goToPrivateChannel(): void {
    this.onNoClick();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
