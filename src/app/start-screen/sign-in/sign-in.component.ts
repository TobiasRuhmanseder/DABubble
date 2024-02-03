import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    CommonModule
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})

export class SignInComponent {
  inputFocused = false;

  constructor(private router: Router, public LoginService: LoginService) { }

  profileForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-ZäöüÄÖÜß]+ [a-zA-ZäöüÄÖÜß]+$/)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    acceptTerms: new FormControl (false, Validators.required)
  });

  get name() {
    return this.profileForm.get('name');
  }

  get email() {
    return this.profileForm.get('email');
  }

  get password() {
    return this.profileForm.get('password');
  }

  // hides the alert message as long as the input field is not selected
  inputFocusOn() {
    this.inputFocused = true;
    this.LoginService.mailInUse = '';
  }

  signIn() {
    const name = this.profileForm.get('name')?.value;
    const email = this.profileForm.get('email')?.value;
    const password = this.profileForm.get('password')?.value;
  
    if (name && email && password) {
      this.LoginService.userName = name;
      this.LoginService.signIn(email, password);
      this.router.navigate(['/choose-avatar']);
    } 
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
