import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-choose-avatar',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './choose-avatar.component.html',
  styleUrl: './choose-avatar.component.scss'
})

export class ChooseAvatarComponent implements OnInit {
  defaultAvatar: string = './../../../assets/img/user_pics/default_user.svg';
  avatars: string[] = [
    './../../../assets/img/user_pics/female1.svg',
    './../../../assets/img/user_pics/male1.svg',
    './../../../assets/img/user_pics/male2.svg',
    './../../../assets/img/user_pics/female2.svg',
    './../../../assets/img/user_pics/male3.svg',
    './../../../assets/img/user_pics/male4.svg',
  ];
  imgFile: any = {};


  constructor(private router: Router, public LoginService: LoginService) { }

  ngOnInit(): void {
    this.LoginService.customAvatar$.subscribe((url: any) => {
      this.defaultAvatar = url;
      this.LoginService.loadAvatarBtnDisabled = false;
    });
  }

  uploadFile(event: any) {
    this.LoginService.loadAvatarBtnDisabled = true;
    this.imgFile = event.target.files[0];
    this.LoginService.handleProfileImageUpload(this.imgFile, this.generateRandomId());
  }

  generateRandomId() {
    return Math.random().toString(36).substring(2, 15);
  }

  chooseAvatar(avatar: string) {
    if (avatar) {
      this.defaultAvatar = avatar;
      this.LoginService.userImg = avatar;
    }
  }

  saveAvatar() {
    this.LoginService.saveUserDetails();
  }

  navigateToLogin() {
    this.router.navigate(['']);
  }

  navigateToLegalNotice() {
    this.router.navigate(['/legal-notice']);
  }

  navigateToPrivacyPolicy() {
    this.router.navigate(['/privacy-policy']);
  }
}
