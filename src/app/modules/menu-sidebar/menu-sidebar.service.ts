import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class MenuSidebarService {
  private subject = new Subject<any>();

  toggle (sidebarClass: string, layoutClass: string) {
    this.subject.next({ sidebarClass: sidebarClass, layoutClass: layoutClass });
  }

  getMessage (): Observable<any> {
    return this.subject.asObservable();
  }
}
