import { CoreCommonModule } from '../../../shared/core-common.module';
import { HeaderComponent } from './header/header.component';
import { StepThreeActivationComponent } from './step-three-activation/step-three-activation.component';
import { StepOneActivationComponent } from './step-one-activation/step-one-activation.component';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordVerificationModule } from '@app/shared/components/password-verification/password-verification.module';

// https://angular.io/styleguide#!#04-10
@NgModule({
  imports: [
    CommonModule,
    CoreCommonModule,
    PasswordVerificationModule
  ],
  providers: [
  ],
  declarations: [
    StepOneActivationComponent,
    StepThreeActivationComponent,
    HeaderComponent
  ],
  exports: [
    StepOneActivationComponent,
    StepThreeActivationComponent,
    HeaderComponent
  ]
})

// https://github.com/ocombe/ng2-translate/issues/209
export class CommonComponentsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CommonComponentsModule
    };
  }
}
