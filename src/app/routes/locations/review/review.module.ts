import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'
import { ReviewComponent } from './review.component'
import { SharedModule } from '../../../shared/shared.module';
import { NgxGalleryModule } from 'ngx-gallery';
import { LocationCategoryFilterComponent } from '../common/location-category-filter/location-category-filter.component';
import { LocationCommonComponentsModule } from '../common/location-common-components.module';
import { locationReviewRoutes } from './review.routes';
const routes: Routes = [
  { path: '', component: ReviewComponent },
];
@NgModule({
  imports: [
    RouterModule.forChild(locationReviewRoutes),
    SharedModule,
    NgxGalleryModule,
    LocationCommonComponentsModule
  ],
  providers: [],
  declarations: [ReviewComponent],
  entryComponents: [LocationCategoryFilterComponent],
  exports: [
    RouterModule
  ]
})
export class ReviewModule { }
