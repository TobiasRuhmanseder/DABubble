import { Component, OnInit, inject } from '@angular/core';
import { UserPicComponent } from '../user-pic/user-pic.component';
import { CurrentUserService } from '../../services/current-user.service';
import { ActiveUser } from '../../interfaces/active-user.interface';

@Component({
  selector: 'app-header-menu',
  standalone: true,
  imports: [UserPicComponent],
  templateUrl: './header-menu.component.html',
  styleUrl: './header-menu.component.scss'
})
export class HeaderMenuComponent implements OnInit {

  currentUserService: CurrentUserService = inject(CurrentUserService);

  activeUser: ActiveUser = { displayName: "", photoURL: "" };

  ngOnInit(): void {
    let user: any = this.currentUserService.getDataFromActiveUser();
    user = this.setActiceUser(user);
    user.photoURL = this.filterImgName(user.photoURL);
    this.activeUser = user;

  }

  filterImgName(path: string) {
    let name = path.split("/");
    return name[name.length - 1];
  }

  setActiceUser(user: any): ActiveUser {
    return {
      displayName: user.displayName || "no User",
      photoURL: user.photoURL || ""
    }
  }
}
