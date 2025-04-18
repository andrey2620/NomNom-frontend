import { provideRouter } from "@angular/router";
import { ApplicationConfig, importProvidersFrom} from '@angular/core';

import { routes } from "./app.routes";
import { provideClientHydration } from "@angular/platform-browser";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { baseUrlInterceptor } from "./interceptors/base-url.interceptor";
import { accessTokenInterceptor } from "./interceptors/access-token.interceptor";
import { handleErrorsInterceptor } from "./interceptors/handle-errors.interceptor";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideOAuthClient } from "angular-oauth2-oidc";

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(
      withInterceptors([
        baseUrlInterceptor,
        accessTokenInterceptor,
        //handleErrorsInterceptor
      ])
    ),
    provideOAuthClient(),
    provideAnimationsAsync(),
    importProvidersFrom(BrowserAnimationsModule),
    importProvidersFrom(ToastrModule.forRoot())
  ]
};
