import { CoreCommonModule } from '@app/shared/core-common.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!
import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedService } from '@app/shared/shared.service';
import { SharedData } from '@app/shared/shared.data';
import { RoutesModule } from './routes/routes.module';
import { HttpRequest, AuthGuard, RoleGuard, NavigationService, TriggerService, AuthInterceptor, EncriptionService } from './common';
import { ToastrModule } from 'ngx-toastr';
import en from '@angular/common/locales/en';
import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
registerLocaleData(es);
declare var VERSION_NO;
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json?v=' + VERSION_NO);
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CoreModule,
    CoreCommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RoutesModule,
    ToastrModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    { provide: LOCALE_ID, useValue: 'es-EN' },
    AuthGuard,
    RoleGuard,
    HttpRequest,
    NavigationService,
    TriggerService,
    SharedData,
    EncriptionService,
    SharedService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
