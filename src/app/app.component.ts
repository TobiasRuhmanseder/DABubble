import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderMenuComponent } from './header-menu/header-menu.component';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { MainContentComponent } from './main-content/main-content.component';
import { HomeScreenComponent } from './home-screen/home-screen.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HomeScreenComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'dabubble';
}
