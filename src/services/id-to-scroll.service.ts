import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IdToScrollService {

  id: string = '';


  constructor() { }


  addId(id: string) {
    this.id = id;
    console.log('id transmitted: ' + this.id);

  }

  deleteId() {
    this.id = '';
  }
}
