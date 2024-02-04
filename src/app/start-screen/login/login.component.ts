import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { CurrentUserService } from '../../../services/current-user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(public loginService: LoginService, private CurrentUserService: CurrentUserService) { }

  profileForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  login() {
    const email = this.profileForm.get('email')?.value;
    const password = this.profileForm.get('password')?.value;

    if (email && password) {
      this.loginService.login(email, password);
      // show avtice user
      this.CurrentUserService.activeUser();
    }
  }

  get email() {
    return this.profileForm.get('email');
  }

  get password() {
    return this.profileForm.get('password');
  }

  // hides the alert message after selecting input again
  inputFocusOn() {
    this.loginService.wrongMailOrPassword = '';
  }
}
