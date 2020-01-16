// Core Modules
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Modules
import { SharedModule } from '../shared/shared.module';
import { CommonComponentsModule } from '../common-components/common-components.module';

// Components
import { SiteSettingsComponent } from './site-settings/site-settings.component';
import { BasicSettingsComponent } from './site-settings/basic-settings/basic-settings.component';
import { EmailSettingsComponent } from './site-settings/email-settings/email-settings.component';
import { AddEditEmailTemplateComponent } from './site-settings/email-settings/add-edit-email-template/add-edit-email-template.component';
import { UserFormFieldsSettingsComponent } from './site-settings/user-form-fields-settings/user-form-fields-settings.component';
import { AssignStoreFrontComponent } from './assign-store-front/assign-store-front.component';
import { SelectThemeComponent } from './assign-store-front/select-theme/select-theme.component';
import { BrandingComponent } from './assign-store-front/branding/branding.component';
import { PromotionalBannerComponent } from './assign-store-front/promotional-banner/promotional-banner.component';
import { FeatureSetupComponent } from './feature-setup/feature-setup.component';
import { PricingComponent } from './pricing/pricing.component';
import { ClientVendorProductsComponent } from './products/products.component';
import { AddEditClientVendorProductComponent } from './products/add-edit-product/add-edit-product.component';
import { MaterialModule } from '../material.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule,
    CommonComponentsModule
  ],
  declarations: [
    SiteSettingsComponent,
    BasicSettingsComponent,
    EmailSettingsComponent,
    AddEditEmailTemplateComponent,
    UserFormFieldsSettingsComponent,
    AssignStoreFrontComponent,
    SelectThemeComponent,
    BrandingComponent,
    PromotionalBannerComponent,
    FeatureSetupComponent,
    PricingComponent,
    ClientVendorProductsComponent,
    AddEditClientVendorProductComponent
  ],
  exports: [
    SiteSettingsComponent,
    BasicSettingsComponent,
    EmailSettingsComponent,
    AddEditEmailTemplateComponent,
    UserFormFieldsSettingsComponent,
    AssignStoreFrontComponent,
    SelectThemeComponent,
    BrandingComponent,
    PromotionalBannerComponent,
    FeatureSetupComponent,
    PricingComponent,
    ClientVendorProductsComponent,
    AddEditClientVendorProductComponent
  ],
  entryComponents: [
    AddEditEmailTemplateComponent,
    AddEditClientVendorProductComponent
  ],
  providers: [

  ]
})
export class ClientVendorSetupTabsModule { }
