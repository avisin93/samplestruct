/**
* Component     : Shared
 
* Creation Date : 22nd May 2018
*/


import { NgModule, ModuleWithProviders } from '@angular/core';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { RatingModule } from 'ngx-bootstrap/rating';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { DatepickerModule } from 'ngx-bootstrap/datepicker';
import { SparklineDirective } from './directives/sparkline/sparkline.directive';
// import { EasypiechartDirective } from './directives/easypiechart/easypiechart.directive';
import { ColorsService } from './colors/colors.service';
import { CheckallDirective } from './directives/checkall/checkall.directive';
import { VectormapDirective } from './directives/vectormap/vectormap.directive';
import { NowDirective } from './directives/now/now.directive';
import { ScrollableDirective } from './directives/scrollable/scrollable.directive';
import { JqcloudDirective } from './directives/jqcloud/jqcloud.directive';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { OnlyNumberDirective, AlphaNumericDirective, ActionPermissionDirective, OnlyDecimalDirective, UIControlPermissionDirective, DisableControlDirective } from './directives/custom';
import { BreadcrumbComponent, UnauthorizedAccessComponent  } from './components';
import {  FilterArrayPipe, FillZeroPipe, AbsoluteValuePipe, NumberFormatPipe, DateFormatPipe } from './pipes';
import { MyDatePickerModule } from 'mydatepicker';
import { ImageCropperModule } from 'ng2-img-cropper';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FileUploadModule } from 'ng2-file-upload';
import { LightboxModule } from 'ngx-lightbox';
import { TagInputModule } from 'ngx-chips';
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { CoreCommonModule } from './core-common.module';
import { TruncateStringPipe } from './pipes/truncate-string.pipe';
import { LoginComponent } from '../routes/pages/login/login.component';
import { NgxContextModule } from 'ngx-context';
// import { PdfViewerModule } from 'ng2-pdf-viewer';


@NgModule({
  imports: [
    CoreCommonModule,
    FileUploadModule,
    AccordionModule.forRoot(),
    AlertModule.forRoot(),
    ButtonsModule.forRoot(),
    CarouselModule.forRoot(),
    CollapseModule.forRoot(),
    DatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    ProgressbarModule.forRoot(),
    RatingModule.forRoot(),
    TabsModule.forRoot(),
    TimepickerModule.forRoot(),
    TooltipModule.forRoot(),
    PopoverModule.forRoot(),
    TypeaheadModule.forRoot(),
    FileUploadModule,
    ImageCropperModule,
    NgxDatatableModule,
    MyDatePickerModule,
    ImageCropperModule,
    InfiniteScrollModule,
    LightboxModule,
    TagInputModule,
    MyDateRangePickerModule,
    NgxContextModule
    // PdfViewerModule
  ],
  providers: [
    ColorsService
  ],
  declarations: [
    SparklineDirective,
    // EasypiechartDirective,
    CheckallDirective,
    VectormapDirective,
    NowDirective,
    ScrollableDirective,
    JqcloudDirective,
    OnlyNumberDirective,
    AlphaNumericDirective,
    ActionPermissionDirective,
    OnlyDecimalDirective,
    UIControlPermissionDirective,
    DisableControlDirective,
    BreadcrumbComponent,
    UnauthorizedAccessComponent,
    FilterArrayPipe,
    FillZeroPipe,
    AbsoluteValuePipe,
    TruncateStringPipe,
    DateFormatPipe
  ],
  exports: [
    CoreCommonModule,
    AccordionModule,
    AlertModule,
    ButtonsModule,
    CarouselModule,
    CollapseModule,
    DatepickerModule,
    BsDropdownModule,
    ModalModule,
    PaginationModule,
    ProgressbarModule,
    RatingModule,
    TabsModule,
    TimepickerModule,
    TooltipModule,
    PopoverModule,
    TypeaheadModule,
    SparklineDirective,
    // EasypiechartDirective,
    CheckallDirective,
    VectormapDirective,
    NowDirective,
    ScrollableDirective,
    JqcloudDirective,
    OnlyNumberDirective,
    AlphaNumericDirective,
    NgxDatatableModule,
    ActionPermissionDirective,
    MyDatePickerModule,
    OnlyDecimalDirective,
    UIControlPermissionDirective,
    DisableControlDirective,
    BreadcrumbComponent,
    UnauthorizedAccessComponent,
    FileUploadModule,
    ImageCropperModule,
    InfiniteScrollModule,
    FilterArrayPipe,
    LightboxModule,
    TagInputModule,
    MyDateRangePickerModule,
    FillZeroPipe,
    AbsoluteValuePipe,
    TruncateStringPipe,
    DateFormatPipe,
    NgxContextModule
  ]
})

// https://github.com/ocombe/ng2-translate/issues/209
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule
    };
  }
}
