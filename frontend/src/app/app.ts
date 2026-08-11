import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './services/auth';
import { InactivityService } from './services/inactivity';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  isLoginPage = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private inactivityService: InactivityService
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isLoginPage = event.urlAfterRedirects.includes('/login');

        if (this.authService.isLoggedIn() && !this.isLoginPage) {
          this.inactivityService.start();
        }

        if (this.isLoginPage) {
          this.inactivityService.stop();
        }
      });
  }

  logout() {
    this.inactivityService.stop();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}