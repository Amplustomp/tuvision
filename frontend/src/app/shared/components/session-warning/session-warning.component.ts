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
  isRefreshing = false;
  countdown = 300;
  private subscription = new Subscription();
  private countdownInterval: ReturnType<typeof setInterval> | null = null;
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
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.stopCountdown();
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

  get formattedCountdown(): string {
    const minutes = Math.floor(this.countdown / 60);
    const seconds = this.countdown % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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

  logout(): void {
    this.authService.logout();
  }
}
