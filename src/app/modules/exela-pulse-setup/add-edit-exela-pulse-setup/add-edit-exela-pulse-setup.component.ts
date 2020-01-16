import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { RequestService } from '../../request.service';

@Component({
  selector: 'app-add-edit-exela-pulse-setup',
  templateUrl: './add-edit-exela-pulse-setup.component.html',
  styleUrls: ['./add-edit-exela-pulse-setup.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AddEditExelaPulseSetupComponent implements OnInit {

  @Input('heading') heading = 'Add Pulse';
  @Input('saveButtonTitle') saveBtnTitle = 'Add';
  @Input('mode') mode = '';
  @Input('organizationId') organizationId = '';
  @Input('selectedChartType') selectedChartType = '';

  formElementDataTypes: Array<any> = [
    { value: 'text', text: 'Text' },
    { value: 'date', text: 'Date' },
    { value: 'number', text: 'Number' }
  ];
  chipValue: string;

  chips = [];

  remove (item) {
    this.colorArray.splice(item, 1);
  }

  add (value) {
    if (this.selectedChartType === 'barChart' || this.selectedChartType === 'horizontalBarChart' || this.selectedChartType === 'radarChart') {
      if (this.colorArray.length < 1) {
        this.colorArray.push(value);
        this.chipValue = '';
      }
    } else if (this.colorArray.length < 16) {
      this.colorArray.push(value);
      this.chipValue = '';
    }
  }

  removeByKey (value) {
    if (value.length < 1) {
      if (this.colorArray.length > 0) {
        this.colorArray.pop();
      }
    }
  }

  graphTypes = [
    { value: 'barChart', displayName: 'Bar Chart' },
    { value: 'barWithLineChart', displayName: 'Bar With Line Chart' },
    { value: 'bubleChart', displayName: 'Buble Chart' },
    { value: 'donutChart', displayName: 'Donut Chart' },
    { value: 'horizontalBarChart', displayName: 'Horizontal Bar' },
    { value: 'lineChart', displayName: 'Line Chart' },
    { value: 'multiAxisBar', displayName: 'Multi AxisBar' },
    { value: 'multiAxisLineChart', displayName: 'Multi Axis Line Chart' },
    { value: 'multiBarChart', displayName: 'Multi Bar Chart' },
    { value: 'pieChart', displayName: 'Pie Chart' },
    { value: 'polarAreaChart', displayName: 'Polar Area Chart' },
    { value: 'pointStyleChart', displayName: 'Point Style Chart' },
    { value: 'radarChart', displayName: 'Radar Chart' },
    { value: 'scatterChart', displayName: 'Scatter Chart' },
    { value: 'scatterMultiAxisChart', displayName: 'Scatter Multi Axis Chart' },
    { value: 'stackedBarChart', displayName: 'Stacked Bar' },
    { value: 'stackedGroupBarChart', displayName: 'Stacked Group Bar Chart' },
    { value: 'stappedLineChart', displayName: 'Stapped Line Chart' }
  ];

  graphCodes = [
    { 'value': 'GC0007', 'displayName': 'Queue Documents' },
    { 'value': 'GC0008', 'displayName': 'Document Scanning Volumes' }
  ];

  legendPosition = [
    { 'value': 'top', 'displayName': 'Top' },
    { 'value': 'bottom', 'displayName': 'Bottom' },
    { 'value': 'left', 'displayName': 'Left' },
    { 'value': 'right', 'displayName': 'Right' }
  ];

  animations = [
    'easeInQuad', 'easeOutQuad', 'easeInOutQuad', 'easeInCubic', 'easeOutCubic', 'easeInOutCubic',
    'easeInQuart', 'easeOutQuart', 'easeInOutQuart', 'easeInQuint', 'easeOutQuint', 'easeInOutQuint',
    'easeInSine', 'easeOutSine', 'easeInOutSine', 'easeInExpo', 'easeOutExpo', 'easeInOutExpo',
    'easeInCirc', 'easeOutCirc', 'easeInOutCirc', 'easeInElastic', 'easeOutElastic', 'easeInOutElastic',
    'easeInBack', 'easeOutBack', 'easeInOutBack', 'easeInBounce', 'easeOutBounce', 'easeInOutBounce','linear'
  ];

  clients = [];
  projects = [];
  dbDocType: any;
  graphTypeError: boolean = false;
  graphCodeError: boolean = false;
  animationError: boolean = false;
  colorArray = [];
  isGraphCodeDisabled: boolean = false;

  addEditPulseSetupForm: FormGroup;

  numberPattern = '^(0|[1-9][0-9]*)$';

  constructor (
    private _fb: FormBuilder,
    public _dialogRef: MatDialogRef<AddEditExelaPulseSetupComponent>,
    public _toastCtrl: ToastrService,
    private requestService: RequestService
  ) {
    this.addEditPulseSetupForm = this._fb.group({
      _id: new FormControl(),
      graphTitle: new FormControl('', [Validators.required]),
      graphCode: new FormControl({ value: '', disabled: this.isGraphCodeDisabled }, [Validators.required]),
      graphType: new FormControl('', [Validators.required]),
      options: new FormGroup({
        legend: new FormGroup({
          position: new FormControl(''),
          labels: new FormGroup({
            boxWidth: new FormControl(''),
            fontSize: new FormControl('')
          })
        }),
        tooltips: new FormGroup({
          enabled: new FormControl(true)
        }),
        animation: new FormGroup({
          easing: new FormControl('', [Validators.required]),
          duration: new FormControl('', [Validators.pattern(this.numberPattern), Validators.maxLength(8)])
        }),
        scales: new FormGroup({
          yAxes: new FormArray([
            new FormGroup({
              scaleLabel: new FormGroup({
                display: new FormControl(true),
                fontSize: new FormControl('', [Validators.pattern(this.numberPattern), Validators.maxLength(8)]),
                labelString: new FormControl('')
              })
            })
          ]),
          xAxes: new FormArray([
            new FormGroup({
              scaleLabel: new FormGroup({
                display: new FormControl(true),
                fontSize: new FormControl('', [Validators.pattern(this.numberPattern), Validators.maxLength(8)]),
                labelString: new FormControl('')
              })
            })
          ])

        }),
        color: new FormControl('')
      }),
      active: true,
      sequence: new FormControl('', [Validators.pattern(this.numberPattern)]),
      organizationId: new FormControl('')
    });
  }

  ngOnInit (): void {
    if (this.mode === 'Edit') {
      this.addEditPulseSetupForm.get('graphCode').disable();
    }
  }

  savePulseSetup ({ value, valid }: { value: any, valid: boolean }) {
    this.formatRequest(value.options);
    if (!valid) {
      if (value.graphType === '') {
        this.graphTypeError = true;
      }
      if (value.graphCode === '') {
        this.graphCodeError = true;
      } if (value.easing === undefined || value.easing === '') {
        this.animationError = true;
      }
      this.addEditPulseSetupForm.markAsDirty();
    } else {
      this.addEditPulseSetupForm.markAsPristine();
      if (this.mode !== 'Edit') {
        value.organizationId = this.organizationId;
      }
      if (this.colorArray.length > 0) {
        value.options['color'] = this.colorArray;
      }
      delete value.graphCodeName;

      const newObject: any = {
        _id: value._id,
        graph_code: value.graphCode,
        graph_title: value.graphTitle,
        graph_type: value.graphType,
        options: value.options,
        organization_id: value.organizationId,
        sequence: value.sequence,
        active: value.active
      };

      if (this.mode === 'Edit') {
        this.requestService.doPUT(`/api/pulse/${newObject._id}`, newObject, 'API_CONTRACT').subscribe(res => {
          this._toastCtrl.success('Updated Successfully !');
          this._dialogRef.close('save');
        }, error => {
          if (error.status === 400) {
            this._toastCtrl.error(error);
          } else {
            this._toastCtrl.error('Something went wrong');
          }
        });
      } else {
        this.requestService.doPOST('/api/pulse', newObject, 'API_CONTRACT').subscribe(res => {
          this._toastCtrl.success('Added Successfully !');
          this._dialogRef.close('save');
        }, error => {
          if (error.status === 400) {
            this._toastCtrl.error(error.error);
          } else {
            this._toastCtrl.error('Something went wrong');
          }
        });
      }
    }
  }

  setEditFormValues (details?: any) {
    this.dbDocType = details;
    this.colorArray = details.options.color ? details.options.color : [];
    this.addEditPulseSetupForm.patchValue(details);
    this.addEditPulseSetupForm.get('options.color').reset();
  }

  closePopup () {
    this._dialogRef.close();
  }

  onGraphTypeSelect (event) {
    this.colorArray = [];
    this.selectedChartType = event.value;
    this.addEditPulseSetupForm.controls['options'].reset();
  }

  formatRequest (req) {
    for (let propName in req) {
      if (req[propName] === null || req[propName] === undefined || req[propName] === '') {
        delete req[propName];
      }
      if (typeof req[propName] === 'object') {
        this.formatRequest(req[propName]);
      }
    }

    for (let propName in req) {
      if (typeof req[propName] === 'object') {
        if (Object.keys(req[propName]).length === 0) {
          delete req[propName];
        }
      }
    }
  }

  handleBackspace () {}

  validateNumber (input) {
    if (input.value.length > input.maxLength) input.value = input.value.slice(0, input.maxLength);
  }
}
