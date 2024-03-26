import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { provideToastr } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    {provide:'baseUrl',useValue:'https://localhost:7280/api/',multi:true},
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    provideToastr(),]
};
