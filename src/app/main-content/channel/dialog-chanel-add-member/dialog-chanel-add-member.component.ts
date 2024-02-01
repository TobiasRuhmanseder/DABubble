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

  onNoClick(): void {
    this.dialogRef.close();
  }
}
