import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  isSignUpMode = false;

  fullName = '';
  email = '';
  password = '';
  errorMessage = '';
  successMessage = '';
  infoMessage = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['reason'] === 'inactivity') {
        this.infoMessage = 'You were logged out due to inactivity. Please sign in again.';
      }
    });
  }

  toggleMode() {
    this.isSignUpMode = !this.isSignUpMode;
    this.errorMessage = '';
    this.successMessage = '';
    this.fullName = '';
    this.email = '';
    this.password = '';
  }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.isSignUpMode) {
      this.signUp();
    } else {
      this.login();
    }
  }

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/jobs']);
      },
      error: () => {
        this.errorMessage = 'Invalid email or password';
      }
    });
  }

  signUp() {
    this.userService.createUser({
      fullName: this.fullName,
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.successMessage = 'Account created! You can now sign in.';
        this.isSignUpMode = false;
        this.fullName = '';
        this.email = '';
        this.password = '';
      },
      error: () => {
        this.errorMessage = 'Could not create account. Email may already be in use.';
      }
    });
  }
}