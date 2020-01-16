import { AbstractControl, ValidatorFn, FormControl } from '@angular/forms';

export function getErrorMessage (field: FormControl, customMsg?: JSON): string {
  let msg: string;

  if (field.hasError('invalidDate') || field.hasError('matDatepickerParse')) {
    msg = customMsg && customMsg['invalidDate'] ? customMsg['invalidDate'] : 'Invalid date value';
  } else if (field.hasError('invalidEndDate')) {
    msg = customMsg && customMsg['invalidEndDate'] ? customMsg['invalidEndDate'] : 'End date should be after start date';
  } else if (field.hasError('pattern')) {
    msg = customMsg && customMsg['pattern'] ? customMsg['pattern'] : 'Invalid value';
  } else if (field.hasError('required')) {
    msg = customMsg && customMsg['required'] ? customMsg['required'] : 'This field is required';
  } else if (field.hasError('matchPassword')) {
    msg = customMsg && customMsg['matchPassword'] ? customMsg['matchPassword'] : 'Password do not match';
  } else if (field.hasError('email')) {
    msg = customMsg && customMsg['email'] ? customMsg['email'] : 'Invalid value for email';
  } else if (field.hasError('invalidMail')) {
    msg = customMsg && customMsg['email'] ? customMsg['email'] : 'Invalid value for email';
  } else if (field.hasError('invalidAlphanumericApostrophesAndUnderscoreFormat')) {
    msg = customMsg && customMsg['format'] ? customMsg['format'] : "Incorrect data, Alphanumeric values with only Special characters _ and ' are allowed";
  } else if (field.hasError('invalidAlphabeticFormat')) {
    msg = customMsg && customMsg['format'] ? customMsg['format'] : 'Incorrect data, Alphabetic values are allowed';
  } else if (field.hasError('invalidAlphanumericFormat')) {
    msg = customMsg && customMsg['format'] ? customMsg['format'] : 'Incorrect data, Alphanumeric values are allowed';
  } else if (field.hasError('invalidNumber')) {
    msg = customMsg && customMsg['number'] ? customMsg['number'] : 'Enter numeric value';
  } else if (field.hasError('invalidNumberOnly')) {
    msg = customMsg && customMsg['number'] ? customMsg['number'] : 'Enter Numeric, non-decimal value';
  } else if (field.hasError('longNumber')) {
    msg = customMsg && customMsg['length'] ? customMsg['length'] : 'Incorrect data, number is too long';
  } else if (field.hasError('matDatepickerMin')) {
    msg = customMsg && customMsg['matDatepickerMin'] ? customMsg['matDatepickerMin'] : 'Selected date is before min date';
  } else if (field.hasError('matDatepickerMax')) {
    msg = customMsg && customMsg['matDatepickerMax'] ? customMsg['matDatepickerMax'] : 'Selected date is after max date';
  } else if (field.hasError('invalidPhoneNumber')) {
    msg = customMsg && customMsg['invalidPhoneNumber'] ? customMsg['invalidPhoneNumber'] : 'Phone number is not valid';
  } else if (field.hasError('invalidLocation')) {
    msg = customMsg && customMsg['invalidLocation'] ? customMsg['invalidLocation'] : 'You need to select location from select menu';
  } else if (field.hasError('maxlength')) {
    msg = customMsg && customMsg['maxlength'] ? customMsg['maxlength'] : 'You have more than max number of characters';
  }

  return msg;
}

export function dateValidator (control: AbstractControl): { [key: string]: any } {
  if (control.value && control.value !== '') {
    const date = new Date(control.value);
    return isNaN(date.getTime()) ? { 'invalidDate': { value: control.value } } : null;
  }
  return null;
}

export function endDateValidator (startDateControl: AbstractControl) {
  return (control: AbstractControl) => {
    const endDate = new Date(control.value);
    const startDate = new Date(startDateControl.value);
    return endDate < startDate ? { 'invalidEndDate': { value: control.value } } : null;
  };
}

export function numberValidator (control: AbstractControl): { [key: string]: any } {
  if (control.value) {
    const isNum = isNaN(control.value);
    return isNum ? { 'invalidNumber': { value: control.value } } : null;
  }
}

export function isEmptyString (str) {
  if (typeof str === 'undefined' || !str || str.length === 0 || str === ''
    || !/[^\s]/.test(str) || /^\s*$/.test(str) || str.replace(/\s/g,'') === '') {
    return true;
  } else {
    return false;
  }
}

export function alphanumericApostrophesAndUnderscoreValidator (control: AbstractControl): { [key: string]: any } {
  return control.value && (!/^[a-zA-Z0-9_\' ]+$/.test(control.value)) ? { 'invalidAlphanumericApostrophesAndUnderscoreFormat': { value: control.value } } : null;
}

export function alphanumericValidator (control: AbstractControl): { [key: string]: any } {
  return !/^[a-zA-Z0-9]+$/.test(control.value) ? { 'invalidAlphanumericFormat': { value: control.value } } : null;
}

export function isEmail (control: AbstractControl) {
  let EMAIL_REGEX = /^(([^+<>()\[\]\\.,;:\s@"]+(\.[^+<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return control.value && !EMAIL_REGEX.test(control.value) ? { 'invalidMail' : { value: control.value } } : null;
}

export function numberWithMaxLength (maxLength: number): ValidatorFn {
  return (control: AbstractControl) => {
    if (control.value) {
      let num = control.value.split(' ').join('');
      let isNan = isNaN(num);
      return isNan ? { 'invalidNumber': { value: control.value } } : num.length > maxLength ? { 'longNumber': { value: control.value } } : null;
    }
    return null;
  };
}

export function digitWithSpacesValidator (control: AbstractControl): { [key: string]: boolean } | null {
  const regex = new RegExp('^\\s*[0-9]+\\s*$');
  if (control.value) {
    if (!regex.test(control.value)) {
      return { 'invalidNumberOnly': true };
    }
    return null;
  }
}

export function alphanumericWithSpacesValidator (control: AbstractControl): { [key: string]: any } {
  const regex = new RegExp('^\\s*[a-zA-Z0-9]+\\s*$');
  if (control.value) {
    if (!regex.test(control.value)) {
      return { 'invalidNumberOnly': true };
    }
    return null;
  }
}
