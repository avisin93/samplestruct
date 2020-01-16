import { OnInit, Directive, Input, ElementRef, Renderer2 } from '@angular/core';

import { UI_ACCESS_PERMISSION_CONST } from '../../../config';
declare var $: any;

@Directive({
  selector: 'ui-control-permission'
})
export class UIControlPermissionDirective implements OnInit {

  @Input('uiPermissionObj') public uiPermissionObj: any;
  @Input('fieldName') public fieldName: any;
  @Input('subModuleName') public subModuleName: any;
  @Input('disableProperty') public disableProperty: any;
  @Input('disableSubModuleAction') public disableSubModuleAction: any;
  constructor(public element: ElementRef, public renderer: Renderer2) { }

  ngOnInit() {
    this.checkPermissionAvailable();
  }


  /**
  Remove Native element if field is disabled for given form Control
  **/
  checkPermissionAvailable() {
    if (this.uiPermissionObj && (this.fieldName || this.disableSubModuleAction) && this.disableProperty) {
      if (this.disableProperty == UI_ACCESS_PERMISSION_CONST.disableFields) {
        if (this.uiPermissionObj[this.disableProperty]) {

          if (this.subModuleName) {

            var subModuleObj = this.uiPermissionObj[this.disableProperty][UI_ACCESS_PERMISSION_CONST.subModules][this.subModuleName];
            if (subModuleObj) {

              if (this.disableSubModuleAction) {
                if (subModuleObj[UI_ACCESS_PERMISSION_CONST.disableActions] && subModuleObj[UI_ACCESS_PERMISSION_CONST.disableActions][this.disableSubModuleAction])
                  this.element.nativeElement.remove();
              }
              else {
                if (subModuleObj[this.fieldName]) {
                  this.element.nativeElement.remove();
                } else {
                  if (subModuleObj[this.fieldName] == false) {

                  } else {
                    this.element.nativeElement.remove();
                  }
                }
              }
            }

          } else {
            if (this.uiPermissionObj[this.disableProperty][this.fieldName])
              this.element.nativeElement.remove();
          }
        }
      }
      else {
        if (this.uiPermissionObj[this.disableProperty]) {
          if (this.uiPermissionObj[this.disableProperty][this.fieldName])
            this.element.nativeElement.remove();
        }
      }

    }

   }

}
