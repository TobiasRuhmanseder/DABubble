import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { MainContentBodyComponent } from './main-contents/main-content-body/main-content-body.component';
import { MainContentFooterComponent } from './main-contents/main-content-footer/main-content-footer.component';
import { MainContentHeaderComponent } from './main-contents/main-content-header/main-content-header.component';
import { ChannelComponent } from './channel/channel.component';
import { CommonModule } from '@angular/common';
import { PrivateChatComponent } from './private-chat/private-chat.component';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { CurrentUserService } from '../../services/current-user.service';

@Component({
  selector: 'app-main-content',
  standalone: true,
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss',
  imports: [
    CommonModule,
    MainContentBodyComponent,
    MainContentFooterComponent,
    MainContentHeaderComponent,
    ChannelComponent,
    PrivateChatComponent,
  ],
})
export class MainContentComponent {
  private routeSub!: Subscription;
  constructor(
    public chatService: MessageService,
    public elementRef: ElementRef,
    public renderer: Renderer2,
    private route: ActivatedRoute,
    private user: UsersService,
  ) {}

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
  ngOnInit() {
    this.routeSub = this.route.params.subscribe((params) => {
      this.chatService.resetValues();
      this.chatService.getChannel(params['id']);
      this.chatService.getMessagesFromChannel(params['id']);
    });
    this.user.getAllUsers();
  }

  ngAfterViewInit() {}
  scrollDown() {
    // this.chatService.getSortMessages(
    //   this.chatService.sortedMessages,
    //   this.chatService.messagesList
    // );
    const element =
      this.elementRef.nativeElement.querySelector('#messagesContent');
    this.renderer.setProperty(element, 'scrollTop', 9999);
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (
      this.chatService.editFlaggIndex > -1 &&
      !(event.target as HTMLElement).closest('.message-text-edit')
    ) {
      this.chatService.editFlaggIndex = -1;
    }
  }
}
