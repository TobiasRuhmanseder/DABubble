import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-choose-avatar',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './choose-avatar.component.html',
  styleUrl: './choose-avatar.component.scss'
})

export class ChooseAvatarComponent {
  defaultAvatar: string = 'default_user.svg';
  avatars: string[] = [
    'female1.svg',
    'male1.svg',
    'male2.svg',
    'female2.svg',
    'male3.svg',
    'male4.svg',
  ]

  constructor(private router: Router, public LoginService: LoginService) {
   }

  chooseAvatar(avatar: string) {
    this.defaultAvatar = avatar;
    this.LoginService.userImg = avatar;
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
