import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-session-warning',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './session-warning.component.html',
  styleUrl: './session-warning.component.scss'
})
export class SessionWarningComponent implements OnInit, OnDestroy {
  showWarning = false;
  showInactivityWarning = false;
  isRefreshing = false;
  countdown = 300;
  inactivityCountdown = 60;
  private subscription = new Subscription();
  private countdownInterval: ReturnType<typeof setInterval> | null = null;
  private inactivityCountdownInterval: ReturnType<typeof setInterval> | null = null;
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.subscription.add(
      this.authService.sessionWarning$.subscribe(show => {
        this.showWarning = show;
        if (show) {
          this.startCountdown();
        } else {
          this.stopCountdown();
        }
      })
    );

    this.subscription.add(
      this.authService.inactivityWarning$.subscribe(show => {
        this.showInactivityWarning = show;
        if (show) {
          this.startInactivityCountdown();
        } else {
          this.stopInactivityCountdown();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.stopCountdown();
    this.stopInactivityCountdown();
  }

  private startCountdown(): void {
    this.countdown = 300;
    this.stopCountdown();
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.stopCountdown();
      }
    }, 1000);
  }

  private stopCountdown(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }

  private startInactivityCountdown(): void {
    this.inactivityCountdown = 60;
    this.stopInactivityCountdown();
    this.inactivityCountdownInterval = setInterval(() => {
      this.inactivityCountdown--;
      if (this.inactivityCountdown <= 0) {
        this.stopInactivityCountdown();
      }
    }, 1000);
  }

  private stopInactivityCountdown(): void {
    if (this.inactivityCountdownInterval) {
      clearInterval(this.inactivityCountdownInterval);
      this.inactivityCountdownInterval = null;
    }
  }

  get formattedCountdown(): string {
    const minutes = Math.floor(this.countdown / 60);
    const seconds = this.countdown % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  get formattedInactivityCountdown(): string {
    return this.inactivityCountdown.toString();
  }

  refreshSession(): void {
    this.isRefreshing = true;
    this.authService.refreshToken().subscribe({
      next: () => {
        this.isRefreshing = false;
        this.showWarning = false;
      },
      error: () => {
        this.isRefreshing = false;
      }
    });
  }

  extendSession(): void {
    this.authService.extendSessionFromInactivity();
    this.showInactivityWarning = false;
  }

  logout(): void {
    this.authService.logout();
  }
}
