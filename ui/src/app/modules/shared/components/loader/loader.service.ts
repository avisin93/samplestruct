import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class LoaderService {

  private loaderSubject = new Subject<any>();

  loaderState = this.loaderSubject.asObservable();

  constructor () { }

  show () {
    this.loaderSubject.next(true);
  }

  hide () {
    this.loaderSubject.next(false);
  }
}
