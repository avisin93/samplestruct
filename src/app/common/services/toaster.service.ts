import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';


@Injectable()
export class ToasterService {

  constructor(
    private toastrService: ToastrService
  ) { }

  /**
   * method to show success alert message
   * @param msg as String
   */
  success(msg, clearToasterFlag = false) {
    if(clearToasterFlag) {
      this.clear();
    }
    this.toastrService.success(msg);
  }

  /**
   * method to show error alert message
   * @param msg as String
   */
  error(msg, clearToasterFlag = false) {
    if(clearToasterFlag) {
      this.clear();
    }
    this.toastrService.error(msg);
  }

  /**
   * Clear toastr message
   */
  clear() {
    this.toastrService.clear();
  }

}
