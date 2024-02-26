import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})

export class SignInComponent {
  inputFocused = false;

  /**
  * Constructs the SignInComponent.
  *
  * @param {Router} router - Angular Router service for navigation.
  * @param {LoginService} LoginService - The service for handling user login-related functionality.
  */

  constructor(private router: Router, public LoginService: LoginService) { }

  /**
  * Reactive form Group validates the user sign-in details.
  *
  * @type {FormGroup}
  */
  profileForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-ZäöüÄÖÜß]+ [a-zA-ZäöüÄÖÜß]+$/)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    acceptTerms: new FormControl(false, Validators.required)
  });

  /**
  * Gets the name FormControl from the profileForm.
  */
  get name() {
    return this.profileForm.get('name');
  }

  /**
  * Gets the email FormControl from the profileForm.
  */
  get email() {
    return this.profileForm.get('email');
  }

  /**
  * Gets the password FormControl from the profileForm.
  */
  get password() {
    return this.profileForm.get('password');
  }

  /**
   * Function to handle the input focus event, hiding the alert message when the input field is selected.
   */
  inputFocusOn() {
    this.inputFocused = true;
    this.LoginService.mailInUse = false;
  }

  /**
   * Function to initiate the sign-in process based on the provided user details.
   * It sets the user name and calls the sign-in method from the login service.
   */
  signIn() {
    const name = this.profileForm.get('name')?.value;
    const email = this.profileForm.get('email')?.value;
    const password = this.profileForm.get('password')?.value;

    if (name && email && password) {
      this.LoginService.userName = name;
      this.LoginService.signIn(email, password);
    }
    this.LoginService.mailInUse = false;
  }

  /**
  * Navigates to the login page.
  * Closes alert when email is already reghistered.
  */
  navigateToLogin() {
    this.router.navigate(['']);
    this.LoginService.mailInUse = false;
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
