import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'
import { SharedModule } from '../../../../shared/shared.module';
import { NgxGalleryModule } from 'ngx-gallery';
import { LocationCategoryFilterComponent } from '../../common/location-category-filter/location-category-filter.component';
import { LocationCommonComponentsModule } from '../../common/location-common-components.module';
import { ListReviewService } from './list-review.service';
import { ListReviewComponent } from './list-review.component';
const routes: Routes = [
  { path: '', component: ListReviewComponent },
];
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    NgxGalleryModule,
    LocationCommonComponentsModule
  ],
  providers: [ListReviewService],
  declarations: [ListReviewComponent],
  entryComponents: [LocationCategoryFilterComponent],
  exports: [
    RouterModule
  ]
})
export class ListReviewModule { }
