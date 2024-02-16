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
    private user: UsersService
  ) {}

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
  ngOnInit() {}

  ngAfterViewInit() {
    this.user.getAllUsers();
    this.routeSub = this.route.params.subscribe((params) => {
      if (params['id']) {
        this.chatService.resetValues(params['id']);
        this.scrollDown();
        this.chatService.getChannel(params['id']);
        this.chatService.getMessagesFromChannel(params['id']);
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (
      (this.chatService.editThreadFlaggIndex > -1 ||
        this.chatService.editFlaggIndex > -1) &&
      !(event.target as HTMLElement).closest('.message-text-edit') &&
      !(event.target as HTMLElement).closest('.emojis')
    ) {
      this.chatService.editThreadFlaggIndex = -1;
      this.chatService.editFlaggIndex = -1;
    }
    if ((event.target as HTMLElement).closest('#sendConfirm')) {
      this.scrollDown();
    }
    if ((event.target as HTMLElement).closest('#sendThreadConfirm')) {
      this.scrollDown();
    }
  }
  scrollDown() {
    if (this.chatService.sortedMessages.length > 0) {
      const element =
        this.elementRef.nativeElement.querySelector('#messagesContent');
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    } else {
      setTimeout(() => {
        this.scrollDown();
      }, 100);
    }
  }
}
