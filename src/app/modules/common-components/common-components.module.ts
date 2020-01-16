// Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Modules
import { SharedModule } from '../shared/shared.module';

// Components
import { PriceDetailsComponent } from './price-details/price-details.component';
import { JobsDetailsComponent } from './jobs-details/jobs-details.component';
import { JobDetailsPaymentMethodComponent } from './payment-method/payment-method.component';
import { CostCenterSelectionComponent } from './cost-center-selection/cost-center-selection.component';
import { ChangeFacilityComponent } from './change-facility/change-facility.component';
import { MaterialModule } from '../material.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    PriceDetailsComponent,
    JobsDetailsComponent,
    JobDetailsPaymentMethodComponent,
    CostCenterSelectionComponent,
    ChangeFacilityComponent
  ],
  exports: [
    PriceDetailsComponent,
    JobsDetailsComponent,
    JobDetailsPaymentMethodComponent,
    CostCenterSelectionComponent,
    ChangeFacilityComponent
  ],
  entryComponents: [
    PriceDetailsComponent,
    JobDetailsPaymentMethodComponent,
    CostCenterSelectionComponent,
    ChangeFacilityComponent
  ]
})
export class CommonComponentsModule { }
