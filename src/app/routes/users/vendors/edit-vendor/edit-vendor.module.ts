import { NgModule } from '@angular/core';
import { EditVendorComponent } from './edit-vendor.component';
import { SharedModule } from '../../../../shared/shared.module';
import { Routes, RouterModule } from '@angular/router'
import { EditVendorService } from './edit-vendor-service';
const routes: Routes = [
  { path: '', component: EditVendorComponent },
]
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ],
  providers:[EditVendorService],
  declarations: [EditVendorComponent],
  exports: [
    RouterModule
  ]
})
export class EditVendorModule { }
