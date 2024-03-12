import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import {  MatIconModule } from '@angular/material/icon';
import {  MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-editable-section',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatMenuModule],
  templateUrl: './editable-section.component.html',
  styleUrl: './editable-section.component.scss',
  providers: [
  ]
})
export class EditableSectionComponent {
  @Input() text: any;
  


  constructor() { }

  ngOnInit() { }


}

