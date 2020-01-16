import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxGalleryModule } from 'ngx-gallery';
import { LocationsListService } from './list-location.service';
import { ListLocationComponent } from './list-location.component';
import { SharedModule } from '@app/shared/shared.module';
import { LocationCategoryFilterComponent } from '../../common/location-category-filter/location-category-filter.component';
import { LocationCommonComponentsModule } from '../../common/location-common-components.module';
import { ListLocation } from './list-location';
import { ZipImagesSelectionViewComponent } from './zip-images-selection-view/zip-images-selection-view.component';
import { BreadcrumbComponent } from '@app/shared/components';
const routes: Routes = [
  { path: '', component: ListLocationComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    NgxGalleryModule,
    SharedModule,
    LocationCommonComponentsModule
  ],
  declarations: [ListLocationComponent, ZipImagesSelectionViewComponent],
  entryComponents: [LocationCategoryFilterComponent],
  exports: [
    RouterModule,
    NgxGalleryModule
  ],
  providers: [
    LocationsListService, ListLocation
  ]
})
export class ListLocationModule { }
