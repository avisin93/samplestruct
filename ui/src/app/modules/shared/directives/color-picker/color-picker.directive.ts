import { Directive, OnInit, OnDestroy, ElementRef, Input, Output, EventEmitter } from '@angular/core';

import * as spectrum from './color-picker';

@Directive({
  selector: '[colorPicker]'
})
export class ColorPickerDirective implements OnInit, OnDestroy {

  @Input('controlName') _controlName: string = '';

  @Output('onSelectColor') _onColorSelect = new EventEmitter<any>();

  spectrum: any = spectrum;

  instance: any = null;

  constructor (private _el: ElementRef) {

  }

  ngOnInit () {
    this.instance = this.spectrum(this._el.nativeElement, {
      showInput: true,
      showInitial: true,
      preferredFormat: 'hex',
            // move: (color) => {
            //     let hexColorCode = color.toHexString();
            //     let details = {
            //         colorCode: hexColorCode,
            //         controlName: this._controlName
            //     };
            //     this._onColorSelect.emit(details);
            // },
      change: (color) => {
        let hexColorCode = color.toHexString();
        let details = {
          colorCode: hexColorCode,
          controlName: this._controlName
        };
        this._onColorSelect.emit(details);
      }
    });
  }

  ngOnDestroy () {
    if (this.instance !== null) {
      this.instance.destroy();
    }
  }

}
