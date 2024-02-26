import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { IntroAnimationComponent } from '../intro-animation/intro-animation.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    IntroAnimationComponent,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  /**
  * Constructs the LoginComponent.
  *
  * @param {LoginService} loginService - The service for handling user login-related functionality.
  */
  constructor(public loginService: LoginService) { }

  /**
  * Reactive form representing the user's login information.
  *
  * @type {FormGroup}
  */
  profileForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  /**
  * Handles the user login process by extracting email and password from the form,
  * then calls the login service's login method.
  */
  login() {
    const email = this.profileForm.get('email')?.value;
    const password = this.profileForm.get('password')?.value;

    if (email && password) {
      this.loginService.login(email, password);
    }
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
  * Initiates the guest user login process using predefined guest user data.
  */
  loginGuestUser() {
    this.loginService.login('guest@guest.de', 'guest123');
  }

  /**
  * Initiates the login process with Google account.
  */
  loginWithGoogle() {
    this.loginService.signInWithGoogle();
  }

  /**
   * Clears any error messages related to wrong email or password when the input fields receive focus.
   */
  inputFocusOn() {
    this.loginService.wrongMailOrPassword = '';
  }
}
