import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { CurrentUserService } from '../../../services/current-user.service';
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
  constructor(public loginService: LoginService, public CurrentUserService: CurrentUserService) { }

  profileForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  login() {
    const email = this.profileForm.get('email')?.value;
    const password = this.profileForm.get('password')?.value;

    if (email && password) {
      this.loginService.login(email, password);
    }
  }

  get email() {
    return this.profileForm.get('email');
  }

  get password() {
    return this.profileForm.get('password');
  }

  // login guest
  loginGuestUser() {
    this.loginService.login('guest@guest.de', 'guest123');
  }

  // googlelogin
  loginWithGoogle() {
    this.loginService.signInWithGoogle();
  }

  // hides the alert message after selecting input again
  inputFocusOn() {
    this.loginService.wrongMailOrPassword = '';
  }
}
