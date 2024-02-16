import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAnimations } from '@angular/platform-browser/animations';
import { getStorage, provideStorage } from '@angular/fire/storage';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          projectId: 'dabubble-24c4b',
          appId: '1:747717703770:web:4df20f17755fbc6a578063',
          storageBucket: 'dabubble-24c4b.appspot.com',
          apiKey: 'AIzaSyBHWI2703rPC715eFy0s_yJEEBc2XSw6eI',
          authDomain: 'dabubble-24c4b.firebaseapp.com',
          messagingSenderId: '747717703770',
        })
      )
    ),
    importProvidersFrom(provideAuth(() => getAuth())),
    importProvidersFrom(provideFirestore(() => getFirestore())),
    provideAnimations(),
    provideAnimations(),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          projectId: 'dabubble-24c4b',
          appId: '1:747717703770:web:4df20f17755fbc6a578063',
          storageBucket: 'dabubble-24c4b.appspot.com',
          apiKey: 'AIzaSyBHWI2703rPC715eFy0s_yJEEBc2XSw6eI',
          authDomain: 'dabubble-24c4b.firebaseapp.com',
          messagingSenderId: '747717703770',
        })
      )
    ),
    importProvidersFrom(provideAuth(() => getAuth())),
    importProvidersFrom(provideFirestore(() => getFirestore())),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          projectId: 'dabubble-24c4b',
          appId: '1:747717703770:web:4df20f17755fbc6a578063',
          storageBucket: 'dabubble-24c4b.appspot.com',
          apiKey: 'AIzaSyBHWI2703rPC715eFy0s_yJEEBc2XSw6eI',
          authDomain: 'dabubble-24c4b.firebaseapp.com',
          messagingSenderId: '747717703770',
        })
      )
    ),
    importProvidersFrom(provideAuth(() => getAuth())),
    importProvidersFrom(provideFirestore(() => getFirestore())),
    importProvidersFrom(provideStorage(() => getStorage())),
  ],
};
