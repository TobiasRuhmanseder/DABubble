import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../../services/login.service';
@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  constructor(private router: Router, public LoginService: LoginService) { }

  emailControl = new FormControl('', [Validators.required, Validators.email]);

  resetPassword() {
    console.log('Button works');
    const email = this.emailControl.value;
    if (email) {
      this.LoginService.resetPassword(email);
      this.emailControl.setValue('');
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
