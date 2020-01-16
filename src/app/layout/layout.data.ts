import { Injectable } from '@angular/core';

@Injectable()
export class LayoutData {
    public siteLoaderFlag: boolean = false ;
    /**
    * constructor method is used to initialize members of class
    */
    constructor(
    ) { }

    setSiteLoaderFlag(flag: boolean) {
        this.siteLoaderFlag = flag;
    }
}
