import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidemenuService {
  menuOpen = true;
    /**
   * toggle the sidemenu 
   */
  toggle() {
    this.menuOpen = !this.menuOpen;
  }
  constructor() { }
}
