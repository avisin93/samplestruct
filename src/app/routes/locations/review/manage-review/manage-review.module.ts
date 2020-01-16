import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageReviewComponent } from './manage-review.component';
import { SharedModule } from '@app/shared/shared.module';
import { ManageReviewService } from './manage-review.service';
import { NgxGalleryModule } from 'ngx-gallery';

const routes: Routes = [
  { path: '', component: ManageReviewComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    NgxGalleryModule
  ],
  providers: [ManageReviewService],
  declarations: [ManageReviewComponent],
  exports: [
    RouterModule
  ]
})
export class ManageReviewModule { }
