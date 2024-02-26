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
  defaultAvatar: string = './../../../assets/img/user_pics/default_user.svg'; // Default avatar image URL.
  avatars: string[] = [
    './../../../assets/img/user_pics/female1.svg',
    './../../../assets/img/user_pics/male1.svg',
    './../../../assets/img/user_pics/male2.svg',
    './../../../assets/img/user_pics/female2.svg',
    './../../../assets/img/user_pics/male3.svg',
    './../../../assets/img/user_pics/male4.svg',
  ]; // Array of avatar image URLs, which user can choose.
  imgFile: any = {}; // Saves the selected image file for individual avatar upload.

  /**
    * Constructs the ChooseAvatarComponent.
    *
    * @param router - Angular Router service for navigation.
    * @param LoginService - The service for handling user login-related functionality.
    */
  constructor(private router: Router, public LoginService: LoginService) { }

  /**
   * Lifecycle hook called after component initialization.
   * Subscribes to changes in the custom avatar and updates the default avatar accordingly.
   */
  ngOnInit(): void {
    this.LoginService.customAvatar$.subscribe((url: any) => {
      this.defaultAvatar = url;
      this.LoginService.loadAvatarBtnDisabled = false;
    });
  }

  /**
  * Handles the file upload event for individual avatars.
  *
  * @param event - The file upload event containing selected avatar image.
  */
  uploadFile(event: any) {
    this.LoginService.loadAvatarBtnDisabled = true;
    this.imgFile = event.target.files[0];
    this.LoginService.handleProfileImageUpload(this.imgFile, this.generateRandomId());
  }

  /**
   * Generates a random ID for avatar image file.
   *
   * @returns A random ID string.
   */
  generateRandomId() {
    return Math.random().toString(36).substring(2, 15);
  }

  /**
   * Selects a specific avatar and updates the default avatar and user image in the service.
   *
   * @param avatar - The URL of the selected avatar image.
   */
  chooseAvatar(avatar: string) {
    if (avatar) {
      this.defaultAvatar = avatar;
      this.LoginService.userImg = avatar;
    }
  }

  /**
   * Saves the user details in LoginService.
   */
  saveAvatar() {
    this.LoginService.saveUserDetails();
  }

  /**
  * Navigates to the login page.
  */
  navigateToLogin() {
    this.router.navigate(['']);
  }

  /**
  * Navigates to the legal notice page.
  */
  navigateToLegalNotice() {
    this.router.navigate(['/legal-notice']);
  }

  /**
  * Navigates to the privacy policy page.
  */
  navigateToPrivacyPolicy() {
    this.router.navigate(['/privacy-policy']);
  }
}
