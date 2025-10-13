import { HTTP_INTERCEPTORS, provideHttpClient } from "@angular/common/http";
import { ApplicationConfig } from "@angular/core";
import { provideClientHydration } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter } from "@angular/router"; // ✅ IMPORTANTE
import { routes } from "./app-routing.module";   // ✅ Ya existe gracias al export anterior
import { HeadersInterceptor } from "./interceptors/headers.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideAnimations(),
    provideClientHydration(),
    provideRouter(routes), // ✅ Aquí conectamos las rutas
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeadersInterceptor,
      multi: true,
    },
  ],
};
