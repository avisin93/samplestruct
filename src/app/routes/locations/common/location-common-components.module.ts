import { NgModule, ModuleWithProviders } from '@angular/core';
import { CategoryComponent } from './category/category.component';
import { SharedModule } from '@app/shared/shared.module';
import { CategoryService } from './category/category.service';
import { LocationCategoryFilterComponent } from './location-category-filter/location-category-filter.component';

// https://angular.io/styleguide#!#04-10
@NgModule({
    imports: [
        SharedModule
    ],
    providers: [
        CategoryService
    ],
    entryComponents: [
        CategoryComponent
    ],
    declarations: [
        CategoryComponent,
        LocationCategoryFilterComponent
    ],
    exports: [
        CategoryComponent,
        LocationCategoryFilterComponent
    ]
})

// https://github.com/ocombe/ng2-translate/issues/209
export class LocationCommonComponentsModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: LocationCommonComponentsModule
        };
    }
}
