import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { provideToastr } from 'ngx-toastr';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { httpErrorInterceptor } from './interceptors/http-error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    {provide:'baseUrl',useValue:'https://localhost:7280/api/',multi:true},
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptors([httpErrorInterceptor])),
    provideToastr(),
    importProvidersFrom(
      JwtModule.forRoot({
        config:{
          tokenGetter:()=> localStorage.getItem("token"),
          allowedDomains:["localhost:7280"]
        }
      })
    ),
    provideHttpClient(
      withInterceptorsFromDi()
  ),
  ]
};
