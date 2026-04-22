import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { WelcomeCard } from '../../../shared/components/welcome-card/welcome-card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, WelcomeCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit, OnDestroy {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

   get currentUser() {
    return this.authService.currentUser;
  }

  ngOnInit(): void {
    console.log('Dashboard iniciado - usuario:', this.currentUser());
  }

  ngOnDestroy(): void {
    console.log('Dashboard destruido');
  }

  logout(): void {
    this.authService.logout();
  }

  navigateTo(route: string): void {
    this.router.navigate([`/admin/${route}`]);
  }
}