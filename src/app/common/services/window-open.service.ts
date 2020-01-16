import { Injectable } from '@angular/core';

@Injectable()
export class WindowOpenService {

  constructor() { }
  public getNativeWindow() {
       return window;
   }
}
