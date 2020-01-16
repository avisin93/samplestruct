import { OnInit, Directive, Input, ElementRef, Renderer2 } from '@angular/core';
declare var $: any;

@Directive({
    selector: 'action-permission'
})
export class ActionPermissionDirective implements OnInit {

    @Input('permissionArr') public permissionArr: any;
    @Input('MODULE_ID') public MODULE_ID:any;
    @Input('actionType') public actionType:any;

    constructor(public element: ElementRef, public renderer: Renderer2) { }

    ngOnInit() {
      this.checkPermissionAvailable();
    }


    /**
    Remove Native element if permission is not available for given module
    **/
    checkPermissionAvailable() {
      if(this.permissionArr && this.MODULE_ID) {
        if(!this.permissionArr[this.MODULE_ID][this.actionType]) {
          this.element.nativeElement.remove();
        }
      }
    }


}
