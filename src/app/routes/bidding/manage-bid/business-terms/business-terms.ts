import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../../../../common';
import { DEFAULT_CURRENCY, CURRENCY_CONSTANTS } from '../../Constants';
import * as _ from 'lodash';

@Injectable()
export class BusinessTerms {
    /**
    * constructor method is used to initialize members of class
    */
    constructor(private fb: FormBuilder
    ) { }

    createBuisnessTermsForm(): FormGroup {
        return this.fb.group({
            budgetLineMarkup: this.fb.array([this.createMarkupFormGroup()]),
            commission: [''],
            financialCost: ['', [CustomValidators.checkNumber]],
            erAdjustment: [''],
            baseRateAdjustment: [''],
            targetAgencyFees: [''],
            targetPayrollFees: [''],
            targetLabourFees: [''],
            currency: [DEFAULT_CURRENCY.id, [CustomValidators.required]],
            exchangeRate: this.fb.array([this.createExchangeRateFormGroup()])
        });
    }

    getDefaultCurrencyDropdown() {
        let currencyDropdown = Object.assign([], CURRENCY_CONSTANTS);
        let index = _.findIndex(currencyDropdown, function(obj) { return obj.id == DEFAULT_CURRENCY.id })
        currencyDropdown.splice(index, 1);
        return currencyDropdown;
    }

    /*method to create budgetline markup rate formgroup*/
    createMarkupFormGroup(): FormGroup {
        return this.fb.group({
            sectionName: ['', [CustomValidators.required]],
            markup: ['', [CustomValidators.required]],
            insurance: ['', [CustomValidators.required]],
        });
    }
    /*method to create exchange rate formgroup*/
    createExchangeRateFormGroup(): FormGroup {
        return this.fb.group({
            sourceCurrencyId: [' ', [CustomValidators.required]],
            targetCurrency: [DEFAULT_CURRENCY.id],
            unit: [1],
            exchangeRate: ['', [CustomValidators.required, CustomValidators.checkDecimal]],
            currencies: [this.getDefaultCurrencyDropdown()]
        });
    }
}
