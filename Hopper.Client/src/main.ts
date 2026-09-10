import { bootstrapApplication } from '@angular/platform-browser';
import { mergeApplicationConfig } from '@angular/core';
import { provideToastr } from 'ngx-toastr';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, mergeApplicationConfig(appConfig, {
  providers: [
    provideToastr({
      positionClass: 'toast-bottom-center',
      preventDuplicates: true
    })
  ]
})).catch(err => console.error(err));
