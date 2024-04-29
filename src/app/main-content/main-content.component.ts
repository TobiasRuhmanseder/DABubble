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
import { ViewportScroller } from '@angular/common';
import { IdToScrollService } from '../../services/id-to-scroll.service';

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
    private scroller: ViewportScroller,
    private route: ActivatedRoute,
    public scroll: IdToScrollService,
  ) {}

  unsubCurrentChannelMessages: any;

  ngOnDestroy() {
    if (this.unsubCurrentChannelMessages) {
      this.unsubCurrentChannelMessages.unsubscribe();
    } // this.routeSub.unsubscribe();
  }
  ngOnInit(): void {}

  ngAfterViewInit() {
    this.routeSub = this.route.params.subscribe((params) => {
      if (params['id']) {
        this.chatService.resetValues(params['id']);
        this.chatService.getChannelFromId(params['id']);
        this.chatService.getMessagesFromChannel(params['id']);
        this.chatService.subChannelMessages(params['id']);
        this.chatService.subChannelThreads(params['id']);
      }
    });
    this.scrollTo()
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
    if (!(event.target as HTMLElement).closest('.user-list')){
      this.chatService.mention = false;
    }
    if ((event.target as HTMLElement).closest('#sendConfirm')) {
      this.scrollDown('#messagesContent');
    }
    if ((event.target as HTMLElement).closest('#sendThreadConfirm')) {
      this.scrollDown('#messagesContent');
    }
  }

  scrollTo() {
    if (this.scroll.id.length > 0){
      if('id found'){
        this.scroller.scrollToAnchor(this.scroll.id)
        this.scroll.deleteId()
      } else {
        setTimeout(() => {
          this.scrollTo()
        }, 100);
      }
   
  }}

  scrollDown(id:string) {
    if (this.chatService.sortedMessages.length > 0) {
      const element =
        this.elementRef.nativeElement.querySelector(id);
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    } else {
      setTimeout(() => {
        this.scrollDown(id);
      }, 100);
    }
  }
}
