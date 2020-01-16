import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DEFAULT_CURRENCY } from '../../Constants';
import { CustomValidators } from '@app/common';


@Injectable()
export class EditingAndPost {
  /**
  * constructor method is used to initialize members of class
  */
  constructor(private fb: FormBuilder
  ) { }

  createEditingAndPostFormGroup(): FormGroup {
    return this.fb.group({
      editorAndPost: this.fb.array([this.CreateEditorAndPostFormGroup()]),
      sound: this.createSoundFormGroup(),
      music: this.fb.array([this.CreateMusicsFormGroup()]),
      image: this.createImageGroup()
    });
  }

  // It creates the default structure of contact persons formArray
  CreateMusicsFormGroup(): FormGroup {
    return this.fb.group({
      originalCurrencyId: [DEFAULT_CURRENCY.id],
      original: ['', [CustomValidators.checkDecimal]],
      rightsCurrencyId: [DEFAULT_CURRENCY.id],
      rights: ['', [CustomValidators.checkDecimal]],
      buyOutCurrencyId: [DEFAULT_CURRENCY.id],
      buyOut: ['', [CustomValidators.checkDecimal]],
      invalidFlag: [false]
    });
  }
  CreateEditorAndPostFormGroup(): FormGroup {
    return this.fb.group({
      title: [' '],
      version: [''],
      editorCutdowns: [''],
      pcCutdowns: [''],
      invalidFlag: [false]
    });
  }
  createSoundFormGroup(): FormGroup {
    return this.fb.group({
      editing: ['', [CustomValidators.checkDecimal]],
      editingCurrencyId: [DEFAULT_CURRENCY.id],
      post: ['', [CustomValidators.checkDecimal]],
      postCurrencyId: [DEFAULT_CURRENCY.id]
    });
  }
  createImageGroup(): FormGroup {
    return this.fb.group({
      vfx: ['', [CustomValidators.checkDecimal]],
      vfxCurrencyId: [DEFAULT_CURRENCY.id],
      animation: this.fb.array([this.CreateAnimationFormGroup()]),
      versions: this.fb.array([this.CreateImageVersionsFormGroup()])
    });
  }
  // It creates the default structure of contact persons formArray
  CreateAnimationFormGroup(): FormGroup {
    return this.fb.group({
      amount: ['', [CustomValidators.checkDecimal]],
      currencyId: [DEFAULT_CURRENCY.id]
    });
  }
  CreateImageVersionsFormGroup(): FormGroup {
    return this.fb.group({
      title: ['-'],
      version: ['-'],
      colorTiming: ['', [CustomValidators.checkDecimal]],
      online: ['', [CustomValidators.checkDecimal]]
    });
  }
}

