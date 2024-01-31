import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-hover-change-image',
  standalone: true,
  imports: [],
  templateUrl: './icon-hover-change-image.component.html',
  styleUrl: './icon-hover-change-image.component.scss'
})
export class IconHoverChangeImageComponent {

@Input() unhovered?:string;
@Input() hovered?:string;

}
