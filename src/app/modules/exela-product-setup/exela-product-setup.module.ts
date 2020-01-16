// Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Modules
import { SharedModule } from '../shared/shared.module';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { ExelaProductSetupRoutingModule } from './exela-product-setup-routing.module';
import { ExelaProductSetupComponent } from './exela-product-setup.component';

// Components
import { AddEditExelaProductComponent } from './add-edit-exela-product/add-edit-exela-product.component';
import { ExelaProductMenuSetupComponent } from './add-edit-exela-product/exela-product-menu/exela-product-menu-setup.component';
import { AddEditExelaProductMenuComponent } from './add-edit-exela-product/exela-product-menu/add-edit-exela-product-menu/add-edit-exela-product-menu.component';
import { ExelaProductInformationComponent } from './add-edit-exela-product/exela-product-information/exela-product-information.component';
import { ExelaProductActionMenuComponent } from './add-edit-exela-product/exela-action-menu/exela-action-menu.component';
import { ExelaProductAddEditActionMenuComponent } from './add-edit-exela-product/exela-action-menu/add-edit-exela-action-menu/add-edit-exela-action-menu.component';
import { MaterialModule } from '../material.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    MaterialModule,
    ExelaProductSetupRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonComponentsModule
  ],
  declarations: [
    ExelaProductSetupComponent,
    AddEditExelaProductComponent,
    ExelaProductInformationComponent,
    ExelaProductMenuSetupComponent,
    AddEditExelaProductMenuComponent,
    ExelaProductActionMenuComponent,
    ExelaProductAddEditActionMenuComponent
  ],
  exports: [
    ExelaProductSetupComponent
  ],
  entryComponents: [
    AddEditExelaProductMenuComponent,
    ExelaProductAddEditActionMenuComponent
  ],
  providers: [
  ]
})
export class ExelaProductSetupModule { }
