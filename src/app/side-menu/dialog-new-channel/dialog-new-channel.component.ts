import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef, matDialogAnimations } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogNewChannelAddUserComponent } from '../dialog-new-channel-add-user/dialog-new-channel-add-user.component';



@Component({
  selector: 'app-dialog-new-channel',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './dialog-new-channel.component.html',
  styleUrl: './dialog-new-channel.component.scss'
})
export class DialogNewChannelComponent {
  createButtonActive = false;
  dialog: MatDialog = inject(MatDialog);
  channelForm = new FormGroup({
    channelName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(17)]),
    channelDescription: new FormControl(''),
  })


  constructor(public dialogRef: MatDialogRef<DialogNewChannelComponent>) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  nextUserChoose() {
    this.dialog.open(DialogNewChannelAddUserComponent, {
      height: 'auto',
      position: { bottom: '0px' },

      data: {
        channelName: this.channelForm.get('channelName')?.value,
        channelDescription: this.channelForm.get('channelDescription')?.value
      }
    });
    this.dialogRef.close();
  }
}
