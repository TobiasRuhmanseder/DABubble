import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { UserPicComponent } from '../../../user-pic/user-pic.component';
import { CurrentUserService } from '../../../../services/current-user.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { DirectMessagesService } from '../../../../services/direct-messages.service';
import { CommonModule } from '@angular/common';



CurrentUserService


@Component({
  selector: 'app-direct-message-user-list-element',
  standalone: true,
  imports: [UserPicComponent, CommonModule],
  templateUrl: './direct-message-user-list-element.component.html',
  styleUrl: './direct-message-user-list-element.component.scss'
})
export class DirectMessageUserListElementComponent implements OnInit, OnDestroy {

  router: Router = inject(Router);
  diMeService: DirectMessagesService = inject(DirectMessagesService);
  activeRoute: ActivatedRoute = inject(ActivatedRoute);
  currentUserService: CurrentUserService = inject(CurrentUserService);

  @Input() userName!: string;
  @Input() userUid!: string | undefined;
  @Input() userPic!: string;
  @Input() status!: Boolean;

  allDirectMessages: any;
  activeMessaging = false;
  activeParam!: string;
  unsubParams: any;
  unsubActiveMessaging: any;
  unsubCurrentUser: any;
  currentUser: any;


  async ngOnInit() {
    await this.subParams();
    await this.subActiveMessaging();
    await this.subCurrentUser();
    await this.currentUserService.activeUser();
    await this.diMeService.getCurrentDirectMessages();
  }

  async subParams() {
    this.unsubParams = this.activeRoute.params.subscribe(params => {
      this.activeParam = params['id'];
      this.activeMessaging = false;
      this.checkActive();
    });
  }

  async subActiveMessaging() {
    this.unsubActiveMessaging = this.diMeService.allDirectMessages$.subscribe(obj => {
      this.allDirectMessages = obj;
      this.checkActive();
    })
  }

  async subCurrentUser() {
    this.unsubCurrentUser = this.currentUserService.currentUser.subscribe(obj => {
      this.currentUser = obj;
    })
  }

  checkActive() {
    if (this.allDirectMessages) {
      this.allDirectMessages.forEach((element: any) => {
        if (element.id === this.activeParam) {
          if (this.userUid === this.currentUser.uid) {
            if (element.users[0] === element.users[1]) this.activeMessaging = true;
          }
          else if (element.users.includes(this.userUid) && element.users.includes(this.currentUser.uid)) {
            this.activeMessaging = true;
          }
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.unsubParams.unsubscribe();
    this.unsubActiveMessaging.unsubscribe();
    this.unsubCurrentUser.unsubscribe();
  }

  async chooseId() {
    if (this.userUid != undefined) {
      let directMessageDocId = await this.diMeService.getDocIdFromTheDirectMessaging(this.userUid);
      this.router.navigateByUrl('/home/' + directMessageDocId);
    }
  }
}