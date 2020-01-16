import { NgModule } from '@angular/core';
import { SettingsComponent } from './settings.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
// import { ConfigurationComponent } from './configuration/configuration.component';
import { PaymentTermsComponent } from './payment-terms/payment-terms.component';
import { ApprovalHirerachyComponent } from './approval-hirerachy/approval-hirerachy.component';
import { ApprovalHierarchyService } from './approval-hirerachy/approval-hierarchy.service';
import { settingsRoutes } from './settings.routes';
import { PaymentTermsService } from './payment-terms/payment-terms.service';
import { ConfigurationComponent } from './configuration/configuration.component';
import { CurrenciesComponent } from './currencies/currencies.component';
import { ConfigurationService } from './configuration/configuration.service';
import { CurrenciesService } from './currencies/currencies.service';
// const routes: Routes = [
//   { path: '', component: SettingsComponent },
// ];
@NgModule({
  imports: [
    RouterModule.forChild(settingsRoutes),
    SharedModule
  ],
  providers: [ApprovalHierarchyService, PaymentTermsService, ConfigurationService, CurrenciesService],
  declarations: [SettingsComponent, ApprovalHirerachyComponent, PaymentTermsComponent, ConfigurationComponent, CurrenciesComponent],
  exports: [
    RouterModule
  ],
})
export class SettingsModule { }
