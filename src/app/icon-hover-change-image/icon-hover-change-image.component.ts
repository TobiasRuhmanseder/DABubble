import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-icon-hover-change-image',
  standalone: true,
  imports: [],
  templateUrl: './icon-hover-change-image.component.html',
  styleUrl: './icon-hover-change-image.component.scss'
})
export class IconHoverChangeImageComponent implements OnInit {

@Input() unhovered?:string;
@Input() hovered?:string;
@Input() onClick?:string;

ngOnInit(): void {
  if(this.onClick == undefined) this.onClick = this.hovered;
}

}
