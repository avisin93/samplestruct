import { NgModule } from '@angular/core';
import { ListVendorsComponent } from './list-vendors.component';
import { Routes, RouterModule } from '@angular/router'
import { SharedModule } from '../../../../shared/shared.module';
import { VendorListService } from './list-vendor.service';

const routes: Routes = [
  { path: '', component: ListVendorsComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ],
  providers:[VendorListService],
  declarations: [ListVendorsComponent],
  exports: [
    RouterModule
  ]
})
export class ListVendorsModule { }
