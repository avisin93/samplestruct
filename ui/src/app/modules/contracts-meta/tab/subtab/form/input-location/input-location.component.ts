import { Component, OnInit, Input, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormGroup, ControlContainer, FormControl } from '@angular/forms';
import { getErrorMessage } from 'src/app/modules/utilsValidation';

declare var google: any;

@Component({
  selector: 'cm-contracts-meta-tab-subtab-form-input-location',
  templateUrl: './input-location.component.html',
  styleUrls: ['./input-location.component.scss']
})
export class ContractsMetaTabSubtabFormInputLocationComponent implements OnInit {
  formGroup: FormGroup;
  @Input() addContractMetaModelId: String;
  @Input() field: any;
  @Input() oneSubtab: Boolean;

  selectedLocation: Boolean = false;
  @ViewChild('location') private locationInput: HTMLInputElement;

  constructor (
    private controlContainer: ControlContainer,
    private ref: ChangeDetectorRef
    ) {
  }

  ngOnInit () {
    this.formGroup = this.controlContainer.control as FormGroup;
  }

  ngAfterViewInit (): void {
      // @ts-ignore
    const autocomplete = new google.maps.places.Autocomplete(this.locationInput.nativeElement);
      // Event listener to monitor place changes in the input
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      // Emit the new address object for the updated place
      let formattedAddress = this.getFormattedAddress(autocomplete.getPlace());
      this.formGroup.controls[this.field.database_column_name].setValue(typeof formattedAddress !== 'undefined'
        && typeof formattedAddress !== null ? formattedAddress['formatted_address'] : null);
      this.formGroup.controls[this.field.database_column_name].setErrors(null);
      this.selectedLocation = true;
      this.ref.detectChanges();
    });

  }

  onManualChangeInputLocation (event): void {
    if (!event || (event && !/^[0-9a-z\s\b]$/i.test(event.key) && event.keyCode !== 8)) {
      return;
    }
    if (this.formGroup.controls[this.field.database_column_name].value && this.formGroup.controls[this.field.database_column_name].value.trim() !== '') {
      this.selectedLocation = false;
      this.formGroup.controls[this.field.database_column_name].setErrors({ 'invalidLocation': true });
    } else {
      this.selectedLocation = true;
    }
  }

  getFormattedAddress (place) {
    // @params: place - Google Autocomplete place object
    // @returns: location_obj - An address object in human readable format
    let locationObj = {};
    for (let i in place.address_components) {
      let item = place.address_components[i];

      locationObj['formatted_address'] = place.formatted_address;
      if (item['types'].indexOf('locality') > -1) {
        locationObj['locality'] = item['long_name'];
      } else if (item['types'].indexOf('administrative_area_level_1') > -1) {
        locationObj['admin_area_l1'] = item['short_name'];
      } else if (item['types'].indexOf('street_number') > -1) {
        locationObj['street_number'] = item['short_name'];
      } else if (item['types'].indexOf('route') > -1) {
        locationObj['route'] = item['long_name'];
      } else if (item['types'].indexOf('country') > -1) {
        locationObj['country'] = item['long_name'];
      } else if (item['types'].indexOf('postal_code') > -1) {
        locationObj['postal_code'] = item['short_name'];
      }

    }
    return locationObj;
  }

  getErrorMessage (field: FormControl, customMsg?: JSON): string {
    if (field.touched) {
      return getErrorMessage(field, customMsg);
    }
  }
}
