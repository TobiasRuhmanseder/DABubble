import { Component } from '@angular/core';
import { UserPicComponent } from '../user-pic/user-pic.component';

@Component({
  selector: 'app-header-menu',
  standalone: true,
  imports: [UserPicComponent],
  templateUrl: './header-menu.component.html',
  styleUrl: './header-menu.component.scss'
})
export class HeaderMenuComponent {

}
