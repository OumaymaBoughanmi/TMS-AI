import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class InactivityService {
  private timeoutId: any;
  private readonly TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
  private readonly ACTIVITY_EVENTS = ['mousemove', 'keydown', 'click', 'scroll'];

  constructor(
    private router: Router,
    private authService: AuthService,
    private ngZone: NgZone
  ) {}

  start() {
    this.resetTimer();

    this.ngZone.runOutsideAngular(() => {
      this.ACTIVITY_EVENTS.forEach((event) => {
        window.addEventListener(event, () => this.resetTimer());
      });
    });
  }

  private resetTimer() {
    clearTimeout(this.timeoutId);

    this.timeoutId = setTimeout(() => {
      this.ngZone.run(() => {
        this.logoutDueToInactivity();
      });
    }, this.TIMEOUT_MS);
  }

  private logoutDueToInactivity() {
    this.authService.logout();
    this.router.navigate(['/login'], { queryParams: { reason: 'inactivity' } });
  }

  stop() {
    clearTimeout(this.timeoutId);
  }
}