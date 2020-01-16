import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators, Common } from '@app/common';
import { DEFAULT_MASTER_CONFIG_CURRENCY } from '../../../../config';


@Injectable()
export class TalentInfo {
    /**
    * constructor method is used to initialize members of class
    */
    constructor(private fb: FormBuilder
    ) { }

    createTalentFormGroup(): FormGroup {
        return this.fb.group({
          talentBuyOutForm: this.fb.group({
            term: ['', []],
            media: ['', []],
            territory: ['', []],
            exclusivity: ['', []]
          }),
          principalsForm: this.fb.group({
            principals: this.fb.array([]),
          }),
          secondriesForm: this.fb.group({
            secondries: this.fb.array([]),
          }),
          featuredExtrasForm: this.fb.group({
            featuredExtras: this.fb.array([]),
          }),
          crowdsForm: this.fb.group({
            crowds: this.fb.array([]),
          }),
          genericExtrasForm: this.fb.group({
            genericExtras: this.fb.array([]),
          }),
          specialExtrasForm: this.fb.group({
            specialExtras: this.fb.array([]),
          }),
        });
      }
      // It creates the default structure of contact persons formArray
      CreatePrincipalAndSecondriesFormGroup(): FormGroup {
        return this.fb.group({
          name: [''],
          prep: [''],
          shoot: [''],
          costPerDay: [''],
          currencyId: [DEFAULT_MASTER_CONFIG_CURRENCY.id],
          invalidFlag: [false]
        });
      }
      // It creates the default structure of contact persons formArray
      CreateFeaturedCroudsGenericSpecialFormGroup(): FormGroup {
        return this.fb.group({
          description: [''],
          days: [''],
          quantity: [''],
          invalidFlag: [false]
        });
      }
}

