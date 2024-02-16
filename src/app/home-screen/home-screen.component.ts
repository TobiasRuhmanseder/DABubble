import { Component } from '@angular/core';
import { HeaderMenuComponent } from '../header-menu/header-menu.component';
import { SideMenuComponent } from '../side-menu/side-menu.component';
import { MainContentComponent } from '../main-content/main-content.component';
import { CurrentUserService } from '../../services/current-user.service';
import { MessageService } from '../../services/message.service';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-home-screen',
  standalone: true,
  imports: [HeaderMenuComponent, SideMenuComponent, MainContentComponent],
  templateUrl: './home-screen.component.html',
  styleUrl: './home-screen.component.scss',
})
export class HomeScreenComponent {
  constructor(
    private login: CurrentUserService,
    private chatService: MessageService
  ) {}
  ngAfterViewInit() {
    const auth = getAuth();
    let user = this.login.getDataFromActiveUser(auth);
    this.chatService.currentUser = user.uid;
  }
}
