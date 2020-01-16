import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ProductionParametersComponent } from './production-parameters.component';
import { SharedModule } from '@app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { ProductionParametersService } from './production-parameters.service';
import { ProductionParameters } from './production-parameters';

const routes: Routes = [
  { path: '', component: ProductionParametersComponent }];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProductionParametersComponent],
  exports: [
    RouterModule
  ],
  providers:[ProductionParametersService,ProductionParameters]
})
export class ProductionParametersModule { }
