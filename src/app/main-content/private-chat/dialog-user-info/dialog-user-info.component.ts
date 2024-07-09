import { ChangeDetectorRef, Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsersService } from '../../../../services/users.service';
import { CommonModule } from '@angular/common';
import { DirectMessagesService } from '../../../../services/direct-messages.service';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from '../../../../services/message.service';
import { User } from '../../../../models/user.class';
import { FirebaseService } from '../../../../services/firebase.service';
import {ChangeDetectionStrategy} from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { DialogEditUserImgComponent } from './dialog-edit-user-img/dialog-edit-user-img.component';
import { CurrentUserService } from '../../../../services/current-user.service';

@Component({
  selector: 'app-dialog-user-info',
  standalone: true,
  imports: [CommonModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dialog-user-info.component.html',
  styleUrl: './dialog-user-info.component.scss',
})
export class DialogUserInfoComponent {
  readonly dialog = inject(MatDialog);
  userData: any;
  edit: boolean = false;
  editable: boolean = false;
  diMeService: DirectMessagesService = inject(DirectMessagesService);
  router: Router = inject(Router);
  userNameInput: string = '';
  userEmailInput: string = '';
  userPhotoURL: string = '';
  constructor(
    private currentUser: CurrentUserService,
    private cd: ChangeDetectorRef,
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

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogEditUserImgComponent, {
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userPhotoURL = result;
        this.cd.detectChanges();
      }
    });
  }

  /**
   * @description A FormGroup representing the profile form.
   * @property {FormControl} name - The name field of the form.
   * @property {FormControl} email - The email field of the form.
   */
  profileForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-ZäöüÄÖÜß]+ [a-zA-ZäöüÄÖÜß]+$/),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  /**
   * Enables the edit mode for the user data and populates the input fields
   * with the current user's name and email.
   */
  editUser() {
    this.edit = true;
    this.userNameInput = this.userData.name;
    this.userEmailInput = this.userData.email;
    this.userPhotoURL = this.userData.photoURL;
  }

  /**
   * Opens the default email client with the provided email address in the "To" field.
   * @param {string} email - The email address to send the email to.
   */
  sendEmail(email: string) {
    window.open('mailto:' + email);
  }

  /**
   * Aborts the current editing operation.
   */
  abort() {
    this.edit = false;
  }

  /**
   * Saves the user data after validating the form.
   */
  save() {
    if (this.profileForm.valid) {
      let editData = this.userData;
      editData.name = this.userNameInput;
      editData.email = this.userEmailInput;
      editData.photoURL = this.userPhotoURL;
      let newUserData = new User(editData);
      newUserData.id = this.userData.id;
      this.fire.updateUser(newUserData);
      this.currentUser.editUserDetails(editData.name, editData.email);
      this.abort();
    }
  }

  /**
   * Navigates to the private channel of the specified user.
   * @param {string} userId - The ID of the user whose private channel to navigate to.
   */
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
