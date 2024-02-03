import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { MainContentBodyComponent } from './main-contents/main-content-body/main-content-body.component';
import { MainContentFooterComponent } from './main-contents/main-content-footer/main-content-footer.component';
import { MainContentHeaderComponent } from './main-contents/main-content-header/main-content-header.component';
import { ChannelComponent } from './channel/channel.component';
import { CommonModule } from '@angular/common';
import { FirebaseServiceService } from '../../services/firebase-service.service';

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
  ],
})
export class MainContentComponent {
  constructor(
    public fire: FirebaseServiceService,
    public chatService: MessageService,
    public elementRef: ElementRef,
    public renderer: Renderer2
  ) {
    this.chatService.getAllUsers();
    this.chatService.getCurrentChannel();
  }
  ngAfterViewInit() {
    this.scrollDown();
  }
  scrollDown() {
    const element =
      this.elementRef.nativeElement.querySelector('#messagesContent');
    this.renderer.setProperty(element, 'scrollTop', 9999);
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (
      this.chatService.editFlagg &&
      !(event.target as HTMLElement).closest('.message-text-edit')
    ) {
      this.chatService.channel1MsgTest.forEach((element) => {
        element.editing = false;
      });
      this.chatService.editFlagg = false;
    }
  }
}
