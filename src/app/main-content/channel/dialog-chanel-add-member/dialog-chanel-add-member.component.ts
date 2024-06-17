import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-chanel-add-member',
  standalone: true,
  imports: [],
  templateUrl: './dialog-chanel-add-member.component.html',
  styleUrl: './dialog-chanel-add-member.component.scss'
})
export class DialogChanelAddMemberComponent {


  constructor(
    public dialogRef: MatDialogRef<DialogChanelAddMemberComponent>,
  ) { }

    /**
 * Closes the dialog.
 * @returns {void} This method does not return anything.
 */
  onNoClick(): void {
    this.dialogRef.close();
  }
}
