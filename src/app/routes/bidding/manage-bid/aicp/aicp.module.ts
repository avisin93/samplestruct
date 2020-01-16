import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AicpComponent } from './aicp.component';
import { SharedModule } from '../../../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { SafePipe } from '@app/shared/pipes';
import { AICPService } from './aicp.service';

const routes: Routes = [
  {
    path: '', component: AicpComponent
  }]
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    AicpComponent,
    SafePipe
  ],
  exports: [
    RouterModule
  ],
  providers: [AICPService]
})
export class AicpModule { }
