import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';




@Component({
  selector: 'app-dialog-new-channel',
  standalone: true,
  imports: [MatDialogModule, MatFormField, MatInputModule],
  templateUrl: './dialog-new-channel.component.html',
  styleUrl: './dialog-new-channel.component.scss'
})
export class DialogNewChannelComponent {

}
