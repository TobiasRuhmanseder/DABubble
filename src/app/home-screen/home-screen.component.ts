import { Component } from '@angular/core';
import { HeaderMenuComponent } from '../header-menu/header-menu.component';
import { SideMenuComponent } from '../side-menu/side-menu.component';
import { MainContentComponent } from '../main-content/main-content.component';

@Component({
  selector: 'app-home-screen',
  standalone: true,
  imports: [HeaderMenuComponent, SideMenuComponent, MainContentComponent],
  templateUrl: './home-screen.component.html',
  styleUrl: './home-screen.component.scss'
})
export class HomeScreenComponent {

}
