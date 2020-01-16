
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';
import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider
} from 'angular5-social-login';
import { LoginService } from './login.service';
import { CoreCommonModule } from '@app/shared/core-common.module';
import { TokenService } from '@app/common/services/token.service';

const routes: Routes = [
  { path: '', component: LoginComponent },
]
export function getAuthServiceConfigs() {
  const config = new AuthServiceConfig(
    [
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider('948389574256-etaccqo0fv7jnls186k4f3hepo40f44q.apps.googleusercontent.com')
      }
    ]
  );
  return config;
}

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SocialLoginModule,
    CoreCommonModule
  ],
  declarations: [LoginComponent],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    },
    LoginService,
    TokenService
  ],

  exports: [
    RouterModule
  ]
})
export class LoginModule { }
