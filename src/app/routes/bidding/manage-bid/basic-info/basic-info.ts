import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators, Common } from '@app/common';


@Injectable()
export class BasicInfo {
    /**
    * constructor method is used to initialize members of class
    */
    constructor(private fb: FormBuilder
    ) { }

    /*method to create basic formgroup*/
    createBasicInfoForm(): FormGroup {
        return this.fb.group({
            projectName: ['', [CustomValidators.required]],
            jobNumber: [''],
            shootingLocation: [''],
            brand: this.createBrandOrClientFormGroup(),
            client: this.createBrandOrClientFormGroup(),
            agency: this.createAgencyFormGroup(),
            productionCompany: this.createProductionCompanyFormGroup(),
            biddingProducer: this.createBiddingProducerFormGroup(),
            director: ['', [CustomValidators.required]],
            dp: ['', [CustomValidators.required]],
            commercialTitle: this.fb.array([this.createCommercialTitleFormGroup()])
        })
    }

    /*method to create common formgroup for brand,client*/
    createBrandOrClientFormGroup(): FormGroup {
        return this.fb.group({
            name: [''],
            logoId: [''],
            logoUrl: [''],
            showLoader: [false]
        })
    }
    /*method to create agency formgroup*/
    createAgencyFormGroup(): FormGroup {
        return this.fb.group({
            name: [''],
            logoId: [''],
            logoUrl: [''],
            creative: [''],
            agencyProducer: [''],
            accounts: [''],
            visitingCrew: [''],
            showLoader: [false]
        })
    }
    /*method to create production company formgroup*/
    createProductionCompanyFormGroup(): FormGroup {
        return this.fb.group({
            name: [''],
            logoId: [''],
            logoUrl: [''],
            address: [''],
            telephone: [''],
            website: [''],
            showLoader: [false]
        })
    }
    /*method to create bidding producer formgroup*/
    createBiddingProducerFormGroup(): FormGroup {
        return this.fb.group({
            name: [''],
            email: ['', [CustomValidators.checkEmail]],
            mobile: ['']
        })
    }
    /*method to create commercial title formgroup*/
    createCommercialTitleFormGroup(): FormGroup {
        return this.fb.group({
            title: ['']
        })
    }

}

