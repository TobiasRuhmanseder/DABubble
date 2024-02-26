import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../../services/login.service';
@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  
  /**
   * Constructs the ResetPasswordComponent.
   *
   * @param {Router} router - Angular Router service for navigation.
   * @param {LoginService} LoginService - The service for handling user login-related functionality.
   */
  constructor(private router: Router, public LoginService: LoginService) { }

  /**
  * FormControl validates the email input in the password reset form.
  *
  * @type {FormControl}
  */
  emailControl = new FormControl('', [Validators.required, Validators.email]);

  /**
   * Initiates the password reset process with the provided email address.
   * It calls the 'resetPassword' method from the LoginService and resets the email control's value after submission.
   */
  resetPassword() {
    const email = this.emailControl.value;
    if (email) {
      this.LoginService.resetPassword(email);
      this.emailControl.setValue('');
    }
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
