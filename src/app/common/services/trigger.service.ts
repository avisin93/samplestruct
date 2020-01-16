import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
@Injectable()
export class TriggerService {

  constructor() { }
  private subject = new BehaviorSubject<any>({});

  setEvent(event: any) {
    this.subject.next({ event: event });
  }

  clearEvent() {
    this.subject.next({ event: {} });
  }

  getEvent(): Observable<any> {
    return this.subject.asObservable();
  }
}
