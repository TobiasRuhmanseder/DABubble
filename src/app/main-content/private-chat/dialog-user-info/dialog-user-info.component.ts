import { Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsersService } from '../../../../services/users.service';
import { CommonModule } from '@angular/common';
import { DirectMessagesService } from '../../../../services/direct-messages.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../../../services/message.service';
import { User } from '../../../../models/user.class';
import { FirebaseService } from '../../../../services/firebase.service';

@Component({
  selector: 'app-dialog-user-info',
  standalone: true,
  imports: [CommonModule, MatButtonModule, FormsModule],
  templateUrl: './dialog-user-info.component.html',
  styleUrl: './dialog-user-info.component.scss',
})
export class DialogUserInfoComponent {
  userData: any;
  edit: boolean = false;
  editable: boolean = false;
  diMeService: DirectMessagesService = inject(DirectMessagesService);
  router: Router = inject(Router);
  userNameInput: string = '';
  userEmailInput: string = '';
  constructor(
    public users: UsersService,
    public dialogRef: MatDialogRef<DialogUserInfoComponent>,
    public fire: FirebaseService,
    private chatService: MessageService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.userData = this.users.getUserFromId(data.id);
    if (this.userData.id === this.chatService.currentUser) {
      this.editable = true;
    } else {
      this.editable = false;
    }
  }

  editUser() {
    this.edit = true;
    this.userNameInput = this.userData.name;
    this.userEmailInput = this.userData.email;
  }

  sendEmail(email: string) {
    window.open('mailto:' + email);
  }
  abort() {
    this.edit = false;
  }
  save() {
    
    let editData = this.userData;
    editData.name = this.userNameInput;
    editData.email = this.userEmailInput;
    let newUserData = new User(editData);
    newUserData.id = this.userData.id;
    this.fire.updateUser(newUserData);
    this.abort();
  }
  async goToPrivateChannel(userId: string) {
    if (userId != undefined) {
      let directMessageDocId =
        await this.diMeService.getDocIdFromTheDirectMessaging(userId);
      this.router.navigateByUrl('/home/' + directMessageDocId);
      this.onNoClick();
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
