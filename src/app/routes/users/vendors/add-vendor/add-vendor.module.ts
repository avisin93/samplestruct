import { NgModule } from '@angular/core';
import { AddVendorComponent } from './add-vendor.component';
import { SharedModule } from '../../../../shared/shared.module';
import { Routes, RouterModule } from '@angular/router'
import { AddVendorService } from './add-vendor.service';

const routes: Routes = [
  { path: '', component: AddVendorComponent },
]

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ],
  providers:[AddVendorService],
  declarations: [AddVendorComponent],
  exports: [
    RouterModule
  ]
})
export class AddVendorModule { }
