import { Directive, ElementRef, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';

import { EmitterService } from '../../providers/emitter.service';

import * as carousel from './carousel';

declare var $: any;
declare var jQuery: any;

@Directive({
  selector: '[carousel]'
})
export class CarouselDirective implements OnInit, OnChanges, OnDestroy {

  owlCarousel: any = carousel;

  carouselInstance: any = null;

  @Input() options: any = {};

  @Input() responsive: any = {};

  @Input() navText: Array<any> = [];

  @Input() refresh: any = false;

  @Input() autoWidth: boolean = true;

  @Input() resized: boolean = false;

  constructor (private _el: ElementRef) {
    $ = $ || jQuery;
  }

  ngOnInit () {
    this.options.responsive = this.responsive;
    if (this.navText.length > 0) {
      this.options.navText = this.navText;
    }
    this.options.autoWidth = this.autoWidth;

    EmitterService.get('menuOpenClosed').subscribe((data: any) => {
      if (this.carouselInstance !== null && typeof this.carouselInstance !== 'undefined') {
        this.carouselInstance.trigger('refresh.owl.carousel');
      }
    });
  }

  ngOnChanges (changes: any) {
    if (changes && typeof changes.refresh !== 'undefined' && changes.refresh.currentValue === true) {
      setTimeout(() => {
        this.carouselInstance = $(this._el.nativeElement).owlCarousel(this.options);
      }, 50);
    }

    if (changes && typeof changes.resized !== 'undefined' && changes.resized.currentValue === true) {
      if (this.carouselInstance !== null) {
        this.carouselInstance.trigger('refresh.owl.carousel');
      }
    }
  }

  ngOnDestroy () {
    if (this.carouselInstance !== null) {
      this.carouselInstance.trigger('destroy.owl.carousel').removeClass('owl-loaded');
      delete this.carouselInstance;
    }
  }

}
