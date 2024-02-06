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


  obs = new Observable<any>(observer => {
    observer.next(Math.random());
  })


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

