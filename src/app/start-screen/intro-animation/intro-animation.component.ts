import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-intro-animation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './intro-animation.component.html',
  styleUrl: './intro-animation.component.scss'
})
export class IntroAnimationComponent implements OnInit{
  containerVisible = true;

  ngOnInit() {
    setTimeout(() => {
      this.containerVisible = false;
    }, 3500);
  }
}
