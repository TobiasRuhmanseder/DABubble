import { Component } from '@angular/core';
import { ChannelHeaderComponent } from './channel-header/channel-header.component';
import { ChannelChannelMessageComponent } from './channel-message/channel-channel-message.component';
import { ChannelInputComponent } from './channel-input/channel-input.component';
import { MainContentFooterComponent } from "../main-contents/main-content-footer/main-content-footer.component";

@Component({
    selector: 'app-channel',
    standalone: true,
    templateUrl: './channel.component.html',
    styleUrl: './channel.component.scss',
    imports: [
        ChannelHeaderComponent,
        ChannelChannelMessageComponent,
        ChannelInputComponent,
        MainContentFooterComponent
    ]
})
export class ChannelComponent {

}
