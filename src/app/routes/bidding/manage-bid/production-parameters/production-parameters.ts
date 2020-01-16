import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators, Common } from '@app/common';
import { DEFAULT_MASTER_CONFIG_CURRENCY } from '@app/config';
import { MILEAGE_CONST } from '../../Constants';

@Injectable()
export class ProductionParameters {
    mileageUnitArr: any = Common.keyValueDropdownArr(MILEAGE_CONST, 'text', 'id');
    /**
    * constructor method is used to initialize members of class
    */
    constructor(private fb: FormBuilder
    ) { }

    /*method to create basic formgroup*/
    createProductionParametersForm(): FormGroup {
        return this.fb.group({
            general: this.createGeneralFormGroup(),
            locations: this.createLocationsFormGroup(),
            wardrobe: this.createWardrobeFormGroup(),
            pictureVehicles: this.fb.array([this.createCommonFormGroupWithDays()]),
            carCareAndTransport: this.fb.array([this.createCommonFormGroupWithDays()]),
            specialEffects: this.fb.array([this.createCommonFormGroupWithoutDays()]),
            animals: this.fb.array([this.createCommonFormGroupWithDays()]),
            other1: this.fb.array([this.createCommonFormGroupWithDays()]),
            other2: this.fb.array([this.createCommonFormGroupWithDays()]),
            artDepartment: this.createArtDepartmentFormGroup(),
            equipment: this.createEquipmentFormGroup()
        })
    }

    /*method to create general formgroup */
    createGeneralFormGroup(): FormGroup {
        return this.fb.group({
            locationShootDays: ['', [CustomValidators.checkDecimal]],
            stageShootDays: ['', [CustomValidators.checkDecimal]],
            overtime: ['', [CustomValidators.checkDecimal]],
            locationPrepDays: ['', [CustomValidators.checkDecimal]],
            locationPrelight: [''],
            stagePrepDays: ['', [CustomValidators.checkDecimal]],
            stagePrelight: ['', [CustomValidators.checkDecimal]],
            scoutingDays: ['', [CustomValidators.checkDecimal]],
            directorScoutDays: ['', [CustomValidators.checkDecimal]],
            technicalScoutDays: ['', [CustomValidators.checkDecimal]],
            travelDays: ['', [CustomValidators.checkDecimal]],
            foreignCrewMembers: ['', [CustomValidators.checkDecimal]],
            foreignAgency: [''],
            foreignClient: [''],
            travelMileage: ['', [CustomValidators.checkDecimal]],
            travelMileageUnit: [this.mileageUnitArr.kms],
        })

    }
    /*method to create locations formgroup for brand,client*/
    createLocationsFormGroup(): FormGroup {
        return this.fb.group({
            interior: this.fb.array([this.createCommonFormGroupWithDays()]),
            exterior: this.fb.array([this.createCommonFormGroupWithDays()]),
            special: this.fb.array([this.createCommonFormGroupWithDays()]),
            cityPermits: this.fb.array([this.createCityPermitFormGroup()])
        })
    }
    /*method to create wardrobe formgroup for brand,client*/
    createWardrobeFormGroup(): FormGroup {
        return this.fb.group({
            pcCurrencyId: [DEFAULT_MASTER_CONFIG_CURRENCY.id],
            principalCost: ['', [CustomValidators.checkDecimal]],
            fecCurrencyId: [DEFAULT_MASTER_CONFIG_CURRENCY.id],
            featuredExtraCost: ['', [CustomValidators.checkDecimal]],
            ecCurrencyId: [DEFAULT_MASTER_CONFIG_CURRENCY.id],
            extrasCost: ['', [CustomValidators.checkDecimal]],
        })
    }
    /*method to create wardrobe formgroup for brand,client*/
    createArtDepartmentFormGroup(): FormGroup {
        return this.fb.group({
            setConstruction: this.fb.array([this.createCommonFormGroupWithoutDays()]),
            // setDressing: this.fb.array([this.createCommonFormGroupWithoutDays()]),
            streetSingingOthers: this.fb.array([this.createCommonFormGroupWithoutName()]),
            greens: this.fb.array([this.createCommonFormGroupWithoutName()]),
            specialManufactures: this.fb.array([this.createCommonFormGroupWithoutName()]),
            others: this.fb.array([this.createCommonFormGroupWithoutDays()]),
        })
    }
    /*method to create equipment formgroup for brand,client*/
    createEquipmentFormGroup(): FormGroup {
        return this.fb.group({
            cameras: [''],
            lightiningNightShootEquipment: ['', [CustomValidators.checkDecimal]],
            cameraCar: ['', [CustomValidators.checkDecimal]],
            steadyCam: ['', [CustomValidators.checkDecimal]],
            crane: ['', [CustomValidators.checkDecimal]],
            directSound: ['', [CustomValidators.checkDecimal]]
        })
    }
    /*method to create city permit formgroup*/
    createCityPermitFormGroup(): FormGroup {
        return this.fb.group({
            permitType: [''],
            name: [''],
            days: ['', [CustomValidators.checkDecimal]],
            category: [''],
            invalidFlag: [false]
        })
    }
    /*method to create common formgroup with days field*/
    createCommonFormGroupWithDays(): FormGroup {
        return this.fb.group({
            name: [''],
            days: ['', [CustomValidators.checkDecimal]],
            costPerDay: ['', [CustomValidators.checkDecimal]],
            currencyId: [DEFAULT_MASTER_CONFIG_CURRENCY.id],
            invalidFlag: [false]
        })
    }
    /*method to create common formgroup without days field*/
    createCommonFormGroupWithoutDays(): FormGroup {
        return this.fb.group({
            name: [''],
            costPerDay: ['', [CustomValidators.checkDecimal]],
            currencyId: [DEFAULT_MASTER_CONFIG_CURRENCY.id],
            invalidFlag: [false]
        })
    }
    /*method to create common formgroup without days field*/
    createCommonFormGroupWithoutName(): FormGroup {
        return this.fb.group({
            costPerDay: ['', [CustomValidators.checkDecimal]],
            currencyId: [DEFAULT_MASTER_CONFIG_CURRENCY.id],
        })
    }
}

