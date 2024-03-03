import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';




@Component({
  selector: 'app-dialog-new-channel',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule],
  templateUrl: './dialog-new-channel.component.html',
  styleUrl: './dialog-new-channel.component.scss'
})
export class DialogNewChannelComponent {

  constructor(public dialogRef: MatDialogRef<DialogNewChannelComponent>) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
