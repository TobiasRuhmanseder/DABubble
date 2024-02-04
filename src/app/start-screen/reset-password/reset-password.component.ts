import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  constructor(private router: Router) { }

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
