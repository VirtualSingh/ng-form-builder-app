import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { firebaseConfig } from './firebaseConfig';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()), provideFirebaseApp(() => initializeApp({ projectId: "ng-form-builder-app", appId: "1:745855044535:web:44e41ebd40dfb329c53632", storageBucket: "ng-form-builder-app.firebasestorage.app", apiKey: "AIzaSyCPyc9KtUk83dFSyzJcTcSOYpoSjgJUBdE", authDomain: "ng-form-builder-app.firebaseapp.com", messagingSenderId: "745855044535" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())
  ]
};