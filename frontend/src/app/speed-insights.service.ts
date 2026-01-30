import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { injectSpeedInsights } from '@vercel/speed-insights';
import { filter } from 'rxjs';

/**
 * Service to integrate Vercel Speed Insights with Angular.
 * This service initializes Speed Insights and tracks route changes.
 */
@Injectable({
  providedIn: 'root'
})
export class SpeedInsightsService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private speedInsights: ReturnType<typeof injectSpeedInsights> | null = null;

  constructor() {
    // Only initialize in browser context (not during SSR)
    if (isPlatformBrowser(this.platformId)) {
      this.initialize();
    }
  }

  /**
   * Initializes Vercel Speed Insights and sets up route tracking
   */
  private initialize(): void {
    try {
      // Inject Speed Insights script
      this.speedInsights = injectSpeedInsights({
        framework: 'angular',
        debug: false
      });

      // Track route changes
      this.trackRouteChanges();
    } catch (error) {
      console.error('Failed to initialize Speed Insights:', error);
    }
  }

  /**
   * Tracks route changes and updates Speed Insights with the current route
   */
  private trackRouteChanges(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (this.speedInsights?.setRoute) {
          this.speedInsights.setRoute(event.urlAfterRedirects);
        }
      });
  }
}
