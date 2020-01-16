import { AbstractControl, FormControl, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static MatchPassword(AC: AbstractControl) {
    let password = AC.get('password').value; // to get value in input tag
    let confirmPassword = AC.get('confirmPassword').value; // to get value in input tag
    if (confirmPassword) {
      if (password != confirmPassword) {
        AC.get('confirmPassword').setErrors({ MatchPassword: true })
      } else {
        AC.get('confirmPassword').setErrors(null)
      }
    }
  }
  static checkLimit(c: AbstractControl) {
    let startlimit = c.get('startLimit').value; // to get value in input tag
    let endlimit = c.get('endLimit').value; // to get value in input tag
    if (endlimit) {
      let intStartlimit = parseInt(startlimit);
      let intendlimit = parseInt(endlimit);
      if (intStartlimit >= intendlimit) {
        c.get('endLimit').setErrors({ checkLimit: true })
      } else {
        c.get('endLimit').setErrors(null)
      }
    }
  }

  static required(control: FormControl) {
    if (control.value !== null && control.value !== undefined) {
      return (control.value === "" || control.value.toString().trim() == "") ?
        { "checkRequired": true } : null;
    } else {
      return { "checkRequired": true };
    }
  }
  static requiredWithout0(control: FormControl) {
    if (control.value !== null && control.value !== undefined && control.value > 0) {
      return (control.value === "" || control.value.toString().trim() == "") ?
        { "checkRequired": true } : null;
    } else {
      return { "checkRequired": true };
    }
  }
  static requiredNumber(control: FormControl) {
    if (control.value !== null && control.value !== undefined) {
      return (control.value === "" || control.value.toString().trim() == "" || isNaN(control.value) == true) ?
        { "checkRequired": true } : null;
    } else {
      return { "checkRequired": true };
    }
  }
  static checkDecimal(control: FormControl) {
    if (control.value) {
      var str = control.value.toString();
      var splitStrDotArr = str.split('.');
      return (str.indexOf('.') > -1 && ((str.split('.')[1].length > 2) || (splitStrDotArr.length > 2))) ?
      { "checkDecimal": true } : null;
    }
    else {
      return null;
    }
    }
    static checkUptoFourDecimal(control: FormControl) {
      if (control.value) {
        var str = control.value.toString();
        var splitStrDotArr = str.split('.');
        return (str.indexOf('.') > -1 && ((str.split('.')[1].length > 4) || (splitStrDotArr.length > 2))) ?
        { "checkUptoFourDecimal": true } : null;
      }
      else {
        return null;
      }
      }


  static checkEmail(c: FormControl) {
    if (c.value) {
      let EMAIL_REGEXP = new RegExp("[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}");
      return EMAIL_REGEXP.test(c.value) ?
        null :
        { "checkEmail": true }
    } else {
      return null;
    }
  }
  static checkPassword(c: FormControl) {
    if (c.value) {
      let EMAIL_REGEXP = new RegExp("^(?=.*?[A-Z])(?=.*?[0-9]).{8,}$");
      return EMAIL_REGEXP.test(c.value) ?
        null :
        { "checkPassword": true }
    } else {
      return null;
    }
  }
  static checkAlphaNumeric(c: FormControl) {
    let alphaNumeric = new RegExp("[a-zA-Z0-9]");
    return alphaNumeric.test(c.value) ?
      null :
      { "checkAlphaNumeric": true }
  }
  static checkTelephone(c: FormControl) {
    let TELEPHONE_REGEXP = new RegExp("[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*");
    return TELEPHONE_REGEXP.test(c.value) ?
      null :
      { "checkTelephone": true }
  }


  static checkNumber(c: FormControl): any {
    if (c.value) {
      let number = new RegExp("[0-9]");
      return number.test(c.value) ?
        null :
        { "checkNumber": true }
    } else {
      return null;
    }

  }

  // Number only validation
  static numeric(control: AbstractControl) {
    let val = control.value;

    if (val === null || val === '') return null;

    if (!val.toString().match(/^[0-9]+(\.?[0-9]+)?$/)) return { 'invalidNumber': true };

    return null;
  }


  static max(max: number): ValidatorFn {
    return (control: FormControl): { [key: string]: boolean } | null => {

      let val: number = control.value;

      if (control.pristine || control.pristine) {
        return null;
      }
      if (val <= max) {
        return null;
      }
      return { 'max': true };
    }
  }

  static min(min: number): ValidatorFn {
    return (control: FormControl): { [key: string]: boolean } | null => {

      let val: number = control.value;

      if (control.pristine || control.pristine) {
        return null;
      }
      if (val >= min) {
        return null;
      }
      return { 'min': true };
    }
  }

}
