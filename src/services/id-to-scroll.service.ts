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

  /**
   * this function is used to scroll to a maybe searching message with the id
   * 
   * @param id message id
   */
  addId(id: string) {
    this.idToScrollSubject.next(id);
  }

  /**
   * delete the id
   */
  deleteId() {
    this.idToScrollSubject.next('');
  }

}
