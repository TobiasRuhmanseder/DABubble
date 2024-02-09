import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MessageService } from '../../../../services/message.service';
import { MessageContentComponent } from "./message-content/message-content.component";

@Component({
    selector: 'app-main-content-body',
    standalone: true,
    templateUrl: './main-content-body.component.html',
    styleUrl: './main-content-body.component.scss',
    imports: [CommonModule, MessageContentComponent]
})
export class MainContentBodyComponent {
  constructor(public chatService: MessageService) {}
}
