import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit, OnDestroy {
  profileForm!: FormGroup;
  currentUser!: any;
  successMessage = '';
  errorMessage = '';
  loading = false;

  private destroy$ = new Subject<void>();
  private passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {this.currentUser = this.authService.currentUser;}

  ngOnInit(): void {
    const user = this.currentUser();
    this.profileForm = this.fb.group({
      name: [user?.name, Validators.required],
      email: [user?.email, [Validators.required, Validators.email]],
      password: ['', [
        Validators.minLength(8),
        Validators.pattern(this.passwordPattern)
      ]]
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.profileForm.invalid) return;
    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const data = { ...this.profileForm.value };
    if (!data.password) delete data.password;

    const userId = this.currentUser()!.id;

    this.userService.update(userId, data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.successMessage = 'Perfil actualizado exitosamente';
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Error al actualizar';
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
  }

  logout(): void {
    this.authService.logout();
  }
}