import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-pic',
  standalone: true,
  imports: [],
  templateUrl: './user-pic.component.html',
  styleUrl: './user-pic.component.scss'
})
export class UserPicComponent {

  @Input() status: Boolean = false;
  @Input() online: Boolean = false;
  @Input() userImageName?: String;
}
