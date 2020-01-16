import swal from 'sweetalert2';

export class SweetAlertController {

  constructor () { }

  deleteConfirm (options: any, yesCallback: () => void, noCallback?: () => void) {
    let defaultOptions = {
      title: 'Are you sure ?',
      text: 'You want to delete this',
      type: 'warning',
      width: '370px',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    };

    let alertOptions = Object.assign(defaultOptions, options);

    swal(alertOptions).then(function () {
      if (typeof yesCallback !== 'undefined') {
        yesCallback();
        $('.swal2-container').remove();
      }
    }, function (dismiss) {
      $('.swal2-container').remove();
      if (dismiss === 'cancel' && typeof noCallback !== 'undefined') {
        noCallback();
      }
    });
  }

  sessionTimeout (options: any, yesCallback: () => void, noCallback?: () => void) {
    let defaultOptions = {
      type: 'error',
      title: 'Oops...',
      text: 'Session is expired.'
    };

    let alertOptions = Object.assign(defaultOptions, options);

    swal(alertOptions).then(function () {
      if (typeof yesCallback !== 'undefined') {
        yesCallback();
        $('.swal2-container').remove();
      }
    }, function (dismiss) {
      if (dismiss === 'cancel' && typeof noCallback !== 'undefined') {
        noCallback();
      }
      $('.swal2-container').remove();
    });
  }

  slideSession (options: any, yesCallback: () => void, noCallback?: () => void) {
    let defaultOptions = {
      title: 'Do you want to extend session?',
      text: 'Session is about to exipre...',
      type: 'warning',
      width: '450px',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    };

    let alertOptions = Object.assign(defaultOptions, options);

    swal(alertOptions).then(function () {
      if (typeof yesCallback !== 'undefined') {
        yesCallback();
        $('.swal2-container').remove();
      }
    }, function (dismiss) {
      if (dismiss === 'cancel' && typeof noCallback !== 'undefined') {
        noCallback();
      }
      $('.swal2-container').remove();
    });
  }
}
