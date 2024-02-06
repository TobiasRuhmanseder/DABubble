import { Component, OnInit, inject } from '@angular/core';
import { UserPicComponent } from '../user-pic/user-pic.component';
import { CurrentUserService } from '../../services/current-user.service';
import { ActiveUser } from '../../interfaces/active-user.interface';
import { Observable } from 'rxjs';
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
    this.currentUserService.currentUser.subscribe(user => {
      let currentUser;
      currentUser = this.setActiceUser(user);
      currentUser.photoURL = this.filterImgName(currentUser.photoURL);
      this.activeUser = currentUser;
    });

    this.currentUserService.activeUser();
  }

  filterImgName(path: string) {
    let name = path.split("/");
    return name[name.length - 1];
  }

  setActiceUser(user: any): ActiveUser {
    let activeUser = user;
    if (activeUser == null) {
      activeUser = {
        displayName: "noUser",
        photoURL: "male1.svg"
      }
    }
    else {
      activeUser = {
        displayName: user.displayName,
        photoURL: user.photoURL
      }
    }
    return activeUser;
  }
}

