import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-channel-member',
  standalone: true,
  imports: [],
  templateUrl: './dialog-channel-member.component.html',
  styleUrl: './dialog-channel-member.component.scss'
})
export class DialogChannelMemberComponent {



  constructor(
    public dialogRef: MatDialogRef<DialogChannelMemberComponent>,
  ) { }

    /**
 * Closes the dialog.
 * @returns {void} This method does not return anything.
 */
  onNoClick(): void {
    this.dialogRef.close();
  }
}
