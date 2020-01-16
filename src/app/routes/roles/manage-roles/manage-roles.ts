import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators, Common } from '../../../common';

@Injectable()
export class ManageRoles {

    /**
    * constructor method is used to initialize members of class
    */
    constructor(
        private fb: FormBuilder
    ) { }



    /*create roleDetails formgroup*/
    createRoleDetailsFormGroup(): FormGroup {
        return this.fb.group({
            id: [],
            parentRole: ['', [CustomValidators.required]],
            roleName: ['', [CustomValidators.required]],
            modules: this.fb.array([]),
            landingModuleId: ['', [CustomValidators.required]],
            view: [false],
            create: [false],
            edit: [false],
            delete: [false],
        });
    }

    /*create modules formgroup*/
    createModuleFormGroup(): FormGroup {
        return this.fb.group({
            moduleId: [''],
            menu: [''],
            view: [],
            create: [],
            edit: [],
            delete: [],
            roleId: [],
            id: [],
            advancedSettings: this.createAdvancedSettingsFormGroup(),
            checkRow: [false],
            subModuleLevel: [''],
            canLandingPage: [false]
        });
    }


    /*create advaced settings formgroup*/
    createAdvancedSettingsFormGroup(): FormGroup {
        return this.fb.group({
            uiSettings: [''],
            serverSettings: ['']
        });

    }


}
