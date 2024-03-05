import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog-new-channel-add-user',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, ReactiveFormsModule,CommonModule ],
  templateUrl: './dialog-new-channel-add-user.component.html',
  styleUrl: './dialog-new-channel-add-user.component.scss'
})
export class DialogNewChannelAddUserComponent {

createButtonActive = false;
allUsersChoose = true;

  form = new FormGroup({
    users: new FormControl(''),
  })

  constructor(public dialogRef: MatDialogRef<DialogNewChannelAddUserComponent>) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  allUsersSelect(){
    this.allUsersChoose = true;
  }

  costumUsersSelect(){
    this.allUsersChoose = false;
  }
}
