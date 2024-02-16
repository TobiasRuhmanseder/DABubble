import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-legal-notice',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './legal-notice.component.html',
  styleUrl: './legal-notice.component.scss'
})
export class LegalNoticeComponent {
  constructor(private router: Router) { }
  
  navigateToLogin() {
    this.router.navigate(['']);
  }
}
