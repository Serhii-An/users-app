import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, isDevMode, importProvidersFrom  } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient  } from '@angular/common/http';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { UsersEffects } from './store/users/users.effects';
import { usersReducer } from './store/users/users.reducer';
import { MatDialogModule } from '@angular/material/dialog';
import { LoginEffects } from './store/login/login.effects';
import { loginReducer } from './store/login/login.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    provideStore({ users: usersReducer, login: loginReducer }),
    provideEffects([UsersEffects, LoginEffects]),
    provideStoreDevtools(),
    importProvidersFrom(MatDialogModule)
  ]
};
