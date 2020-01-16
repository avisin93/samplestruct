import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class EmitterService {

    // Event store
  private static _emitters: { [ID: string]: EventEmitter<any> } = {};

    // Set a new event in the store with a given ID as key or return existing event from store.
  static get (ID: string): EventEmitter<any> {
    if (!this.isExist(ID)) {
      this._emitters[ID] = new EventEmitter<any>();
    }

    return this._emitters[ID];
  }

  static isExist (ID: string): boolean {
    if (this._emitters[ID]) {
      return true;
    }

    return false;
  }

  static destroy (ID: string): void {
    if (this.isExist(ID)) {
      delete this._emitters[ID];
    }
  }

}
