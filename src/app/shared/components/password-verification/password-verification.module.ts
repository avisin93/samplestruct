import { NgModule } from '@angular/core';
import { PasswordVerificationComponent } from './password-verification.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
    imports: [
        CommonModule,
        TranslateModule
    ],
    declarations: [PasswordVerificationComponent],
    exports: [
        PasswordVerificationComponent
    ]
})
export class PasswordVerificationModule { }
