import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { SpeedInsightsService } from './speed-insights.service';

/**
 * Factory function to initialize Speed Insights service
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function initializeSpeedInsights(speedInsightsService: SpeedInsightsService) {
  return () => {
    // Service initialization happens in constructor
    // This factory ensures the service is instantiated at app startup
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeSpeedInsights,
      deps: [SpeedInsightsService],
      multi: true
    }
  ]
};
