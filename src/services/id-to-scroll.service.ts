import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IdToScrollService {

  id: string = '';


  constructor() { }
  private idToScrollSubject = new Subject<string>();
  idToScroll$ = this.idToScrollSubject.asObservable();

  addId(id: string) {
    this.idToScrollSubject.next(id);
  }
  deleteId() {
    this.idToScrollSubject.next('');
  }
  // addId(id: string) {
  //   this.id = id;
  //   console.log('id transmitted: ' + this.id);

  // }

  // deleteId() {
  //   this.id = '';
  // }
}
