import { Component } from '@angular/core';
import { UserPicComponent } from '../../user-pic/user-pic.component';


@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [UserPicComponent],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss'
})
export class SearchInputComponent {

}
