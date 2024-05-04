import { Component } from '@angular/core';
import { HeaderMenuComponent } from '../header-menu/header-menu.component';
import { SideMenuComponent } from '../side-menu/side-menu.component';
import { MainContentComponent } from '../main-content/main-content.component';
import { CurrentUserService } from '../../services/current-user.service';
import { MessageService } from '../../services/message.service';
import { getAuth } from 'firebase/auth';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-home-screen',
  standalone: true,
  imports: [HeaderMenuComponent, SideMenuComponent, MainContentComponent],
  templateUrl: './home-screen.component.html',
  styleUrl: './home-screen.component.scss',
})
export class HomeScreenComponent {

  menuOpen = true;

  constructor(
    private login: CurrentUserService,
    private chatService: MessageService,
    private users: UsersService
  ) { }
  ngAfterViewInit() {
    this.setCurrentUser();
  }

  async setCurrentUser(retryCount: number = 0) {
    const auth = getAuth();
    let user = await this.login.getDataFromActiveUser(auth);
    if (user != null) {
      let allUsers = await this.users.getAllUsers();
      let foundUser = allUsers.find((u: any) => u.id === user.uid);
      if (foundUser) {
        this.chatService.currentUser = foundUser.id;
      }
    } else if (retryCount < 10) {
      setTimeout(() => {
        this.setCurrentUser(retryCount + 1);
      }, 1000);
      console.log(
        'Benutzerdaten werden noch geladen. Neuer Versuch in 1 Sekunde...'
      );
    } else {
      console.log(
        'Die Benutzerdaten konnten nicht geladen werden. Maximale Anzahl an Versuchen erreicht.'
      );
    }
  }

  toggle() {
    this.menuOpen = !this.menuOpen;
  }
}
