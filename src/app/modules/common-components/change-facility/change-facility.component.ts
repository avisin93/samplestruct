import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material';

declare var $: any;

@Component({
  selector: 'app-change-facility',
  templateUrl: './change-facility.component.html',
  styleUrls: ['./change-facility.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ChangeFacilityComponent implements OnInit {

  selectedFacility: any = '';

  isFacilitySelected: boolean = true;

  facilities: Array<any> = [];

  constructor (public _dialogRef: MatDialogRef<ChangeFacilityComponent>) {

  }

  ngOnInit () {
    $('.change-facility-popup-wrap').closest('.cdk-overlay-pane').addClass('changeFacilityPopup');

    setTimeout(() => {
      this.facilities = [
        {
          facilityId: 1,
          facilityName: 'NY - Facility 1',
          facilityAddress: '2701 E. Grauwyler Road Irving, TX, USA & 75061',
          facilityDayTime: 'Fri 8:00 AM - 5:00 PM',
          facilityCurrentTime: '09/11/2017, 06:20 PM'
        },
        {
          facilityId: 2,
          facilityName: 'NY - Facility 2',
          facilityAddress: '2701 E. Grauwyler Road Irving, TX, USA & 75061',
          facilityDayTime: 'Fri 8:00 AM - 5:00 PM',
          facilityCurrentTime: '09/11/2017, 06:20 PM'
        },
        {
          facilityId: 3,
          facilityName: 'NY - Facility 3',
          facilityAddress: '2701 E. Grauwyler Road Irving, TX, USA & 75061',
          facilityDayTime: 'Fri 8:00 AM - 5:00 PM',
          facilityCurrentTime: '09/11/2017, 06:20 PM'
        },
        {
          facilityId: 4,
          facilityName: 'NY - Facility 4',
          facilityAddress: '2701 E. Grauwyler Road Irving, TX, USA & 75061',
          facilityDayTime: 'Fri 8:00 AM - 5:00 PM',
          facilityCurrentTime: '09/11/2017, 06:20 PM'
        },
        {
          facilityId: 5,
          facilityName: 'NY - Facility 5',
          facilityAddress: '2701 E. Grauwyler Road Irving, TX, USA & 75061',
          facilityDayTime: 'Fri 8:00 AM - 5:00 PM',
          facilityCurrentTime: '09/11/2017, 06:20 PM'
        },
        {
          facilityId: 6,
          facilityName: 'NY - Facility 6',
          facilityAddress: '2701 E. Grauwyler Road Irving, TX, USA & 75061',
          facilityDayTime: 'Fri 8:00 AM - 5:00 PM',
          facilityCurrentTime: '09/11/2017, 06:20 PM'
        },
        {
          facilityId: 7,
          facilityName: 'NY - Facility 7',
          facilityAddress: '2701 E. Grauwyler Road Irving, TX, USA & 75061',
          facilityDayTime: 'Fri 8:00 AM - 5:00 PM',
          facilityCurrentTime: '09/11/2017, 06:20 PM'
        },
        {
          facilityId: 8,
          facilityName: 'NY - Facility 8',
          facilityAddress: '2701 E. Grauwyler Road Irving, TX, USA & 75061',
          facilityDayTime: 'Fri 8:00 AM - 5:00 PM',
          facilityCurrentTime: '09/11/2017, 06:20 PM'
        }
      ];
    }, 1000);
  }

  saveSelectedFacility () {
    if (this.selectedFacility !== '') {
      this.isFacilitySelected = true;
      this._dialogRef.close(this.selectedFacility);
    } else {
      this.isFacilitySelected = false;
    }
  }

  closePopup () {
    this._dialogRef.close();
  }

}
