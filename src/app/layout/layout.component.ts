import { Component, OnInit } from '@angular/core';
import { LayoutData } from './layout.data';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

    constructor(
        public layoutData: LayoutData
    ) { }

    ngOnInit() {
    }

}
