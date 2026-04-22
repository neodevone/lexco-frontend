import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/interfaces/user.interface';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users implements OnInit, OnDestroy {
  users: User[] = [];
  userForm!: FormGroup;
  editingUser: User | null = null;
  showForm = false;
  errorMessage = '';
  loading = false;

  private destroy$ = new Subject<void>();
  private passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(8), Validators.pattern(this.passwordPattern)]],
      role: ['user', Validators.required]
    });
  }

  loadUsers(): void {
    this.userService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users) => {
          this.users = users;
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.errorMessage = 'Error al cargar usuarios';
          this.cdr.markForCheck();
        }
      });
  }

  openCreate(): void {
    this.editingUser = null;
    this.userForm.reset({ role: 'user' });
    this.userForm.get('password')?.setValidators([
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(this.passwordPattern)
    ]);
    this.userForm.get('password')?.updateValueAndValidity();
    this.showForm = true;
  }

  openEdit(user: User): void {
    this.editingUser = user;
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      role: user.role,
      password: ''
    });
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
    this.showForm = true;
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;
    this.loading = true;

    const data = { ...this.userForm.value };
    if (!data.password) delete data.password;

    const request = this.editingUser
      ? this.userService.update(this.editingUser.id, data)
      : this.userService.create(data);

    request.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.showForm = false;
        this.loading = false;
        this.loadUsers();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al guardar';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  deleteUser(id: number): void {
    if (!confirm('¿Eliminar este usuario?')) return;
    this.userService.delete(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.loadUsers(),
        error: () => {
          this.errorMessage = 'Error al eliminar';
          this.cdr.markForCheck();
        }
      });
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingUser = null;
    this.errorMessage = '';
  }
}