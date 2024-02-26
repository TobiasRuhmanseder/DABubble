import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../services/login.service';


@Component({
  selector: 'app-intro-animation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './intro-animation.component.html',
  styleUrl: './intro-animation.component.scss'
})
export class IntroAnimationComponent implements OnInit{
  containerVisible = true;

  /**
    * Constructs the ChooseAvatarComponent.
    *
    * @param LoginService - The service for handling user login-related functionality.
    */
  constructor(public LoginService: LoginService) {}

  /**
   * Lifecycle hook called after component initialization.
   * Hides animation container after 3500 milliseconds.
   */
  ngOnInit() {
    setTimeout(() => {
      this.containerVisible = false;
      this.LoginService.showIntroAnimation = false;
    }, 3500);
  }
}
