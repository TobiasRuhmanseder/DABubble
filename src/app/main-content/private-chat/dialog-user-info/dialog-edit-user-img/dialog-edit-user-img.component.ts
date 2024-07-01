import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LoginService } from '../../../../../services/login.service';
import { FirebaseApp } from 'firebase/app';
import { FirebaseStorage, StorageReference, UploadMetadata, UploadResult, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

@Component({
  selector: 'app-dialog-edit-user-img',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialog-edit-user-img.component.html',
  styleUrl: './dialog-edit-user-img.component.scss'
})
export class DialogEditUserImgComponent {
  
  constructor(public dialogRef: MatDialogRef<DialogEditUserImgComponent>, public LoginService: LoginService) { }
  avatars: string[] = [
    './../../../assets/img/user_pics/default_user.svg',
    './../../../assets/img/user_pics/female1.svg',
    './../../../assets/img/user_pics/male1.svg',
    './../../../assets/img/user_pics/male2.svg',
    './../../../assets/img/user_pics/female2.svg',
    './../../../assets/img/user_pics/male3.svg',
    './../../../assets/img/user_pics/male4.svg',
  ]; 

  invalidImgType: string = '';
  loadAvatarBtnDisabled: boolean = false;
  imgFile: any = {}; 


  chooseAvatar(avatar: string) {
    this.dialogRef.close(avatar);
  }
  
  uploadFile(event: any) {
    this.loadAvatarBtnDisabled = true;
    this.imgFile = event.target.files[0];
    this.handleProfileImageUpload(this.imgFile, this.generateRandomId())
  }

  handleProfileImageUpload(imgFile: any, customURL: string) {
    this.invalidImgType = '';
    const storage = getStorage();
    const storageRef = ref(storage, 'user_pics/' + customURL);

    if (imgFile.type == 'image/png' || imgFile.type == 'image/jpeg' || imgFile.type == 'image/gif') {
      this.uploadImageToStorage(storageRef, imgFile);
    } else {
      this.handleInvalidImageType();
    };
  }

  handleInvalidImageType() {
    this.invalidImgType = 'Erlaubte Dateiformate: PNG, JPEG und GIF. Bitte wähle eine gültige Datei aus.';
    this.loadAvatarBtnDisabled = false;
  }

  async uploadImageToStorage(storageRef: any, imgFile: any): Promise<void> {
    uploadBytes(storageRef, imgFile).then(() => {
      getDownloadURL(storageRef).then((imgURL) => {
        this.dialogRef.close(imgURL);
        
      });
    });
  }
 
  generateRandomId() {
    return Math.random().toString(36).substring(2, 15);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
