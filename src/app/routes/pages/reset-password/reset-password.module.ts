import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResetPasswordComponent } from './reset-password.component';
import { CoreCommonModule } from '../../../shared/core-common.module';
import { PasswordVerificationModule } from '@app/shared/components/password-verification/password-verification.module';

const routes: Routes = [
  { path: '', component: ResetPasswordComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CoreCommonModule,
    PasswordVerificationModule
  ],
  declarations: [ResetPasswordComponent],
  exports: [
    RouterModule
  ]
})

export class ResetPasswordModule { }
