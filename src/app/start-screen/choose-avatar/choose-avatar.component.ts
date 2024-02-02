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
  defaultAvatar: string = './../../../assets/img/user_pics/default_user.svg';
  avatars: string[] = [
    './../../../assets/img/user_pics/female1.svg',
    './../../../assets/img/user_pics/male1.svg',
    './../../../assets/img/user_pics/male2.svg',
    './../../../assets/img/user_pics/female2.svg',
    './../../../assets/img/user_pics/male3.svg',
    './../../../assets/img/user_pics/male4.svg',
  ]

  constructor(private router: Router, public LoginService: LoginService) { }

  chooseAvatar(avatar: string) {
    this.defaultAvatar = avatar;
  }

  saveAvatar() {
    this.router.navigate(['/home']);
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
