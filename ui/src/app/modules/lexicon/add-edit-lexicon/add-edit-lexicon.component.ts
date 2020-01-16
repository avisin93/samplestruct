import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Pattern } from '../../../models/util/pattern.model';
import { LoaderService } from '../../shared/components/loader/loader.service';
import { LexiconService } from '../lexicon.service';
import { Lexicon } from '../lexicon';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-edit-lexicon',
  templateUrl: './add-edit-lexicon.component.html',
  styleUrls: ['./add-edit-lexicon.component.scss'],
  providers: [LexiconService]

})

export class AddEditLexiconComponent implements OnInit {

  @Input('heading') heading = 'Add Sentiments';

  @Input('saveButtonTitle') saveBtnTitle = 'Save';

  addEditLexiconForm: FormGroup;
  lexicon = new Lexicon();
  lexicons: Lexicon[];
  errorMessage: string;
  isDisabled = false;
  isInvalidWeight: boolean = false;

  constructor (
      private _fb: FormBuilder,
      public _dialogRef: MatDialogRef<AddEditLexiconComponent>,
      public _toastCtrl: ToastrService,
      public lexiconService: LexiconService,
      private loaderService: LoaderService
  ) {
    this.addEditLexiconForm = this._fb.group({
      _id: new FormControl(),
      lexicon: new FormControl('', [Validators.required]),
      tslexicon: new FormControl(''),
      weight: new FormControl('', [this.validateSentimentValue(Pattern.SENTIMENT_VALUE)]),
      active: new FormControl()
    });
  }

  ngOnInit () {}
/*
    saveSentiments({ value, valid }: { value: any, valid: boolean }) {

        this.loaderService.show();
        if (!valid) {
            this.addEditLexiconForm.markAsDirty();
        } else {
            this.addEditLexiconForm.markAsPristine();
            this.lexicon.lexicon = value.lexicon;
            this.lexicon.weight = value.weight;
            if (typeof value.tslexicon != 'undefined') {
                this.lexicon.tslexicon = value.tslexicon;
            }
            else {
                this.lexicon.tslexicon = " ";
            }
            this.lexiconService.saveLexicon(this.lexicon)
                .subscribe(
                lexicons => {
                    this.lexicons = lexicons
                    this.closePopup();
                    this._toastCtrl.successToast("Lexicon added Successfully");
                    this.loaderService.hide();
                },
                (error) => {
                    console.log("saveLexicon", error);
                    this.errorMessage = <any>error
                    this.loaderService.hide();
                    this._toastCtrl.errorToast('Something went wrong');
                }

                );
        }
    }
*/
  addOrUpdateLexicon ({ value, valid }: { value: any, valid: boolean }) {
    if (!valid) {
      this.addEditLexiconForm.markAsDirty();
    } else {
      this.addEditLexiconForm.markAsPristine();
      this.lexicon.lexicon = value.lexicon;
      this.lexicon.weight = Number(value.weight);
      if (typeof value._id !== 'undefined' && value._id !== null) {
        this.lexicon.id = value._id;
        this.lexicon.active = value.active;
      } else {

        this.lexicon.active = true;
      }

      if (typeof value.tslexicon !== 'undefined') {
        this.lexicon.tslexicon = value.tslexicon;
      } else {
        this.lexicon.tslexicon = ' ';
      }

      this.loaderService.show();
      this.lexiconService.addOrUpdateLexicon(this.lexicon).subscribe(lexicons => {
        this.lexicons = lexicons;
        this.closePopup();
        if (!lexicons.status && lexicons.status !== undefined) {
          this._toastCtrl.error(lexicons.message);
        } else {
          this._toastCtrl.success('Operation Successfully');

        }
        this.loaderService.hide();
      },(error) => {
        this.errorMessage = error as any;
        this.loaderService.hide();
        if (error.status === 400) {
          this._toastCtrl.error(error);
        }
                   // this._toastCtrl.errorToast(error);
      },() => {
        this.loaderService.hide();
      });
      this.loaderService.hide();
    }
  }

  setEditFormValues (details?: any) {
    this.isDisabled = true;
    this.addEditLexiconForm.patchValue(details);
  }

  closePopup () {
    this._dialogRef.close();
  }

  validateSentimentValue (exp): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const validateValue = exp.test(control.value);
      return validateValue ? null : { 'exceededValue': { value: control.value } };
    };
  }

}
