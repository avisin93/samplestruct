import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderService } from './loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})

export class LoaderComponent implements OnInit {

  show = false;

  private subscription: Subscription;

  constructor (public loaderService: LoaderService) { }

  ngOnInit () {
    this.subscription = this.loaderService.loaderState.subscribe((state) => {
      setTimeout(() => {
        this.show = state;
      }, 0);
    });
  }

  ngOnDestroy () {
    this.subscription.unsubscribe();
  }

}
