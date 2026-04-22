import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
      <h3 class="text-blue-900 font-semibold">Bienvenido, {{ userName }} 👋</h3>
      <p class="text-blue-600 text-sm">Rol: {{ userRole === 'admin' ? 'Administrador' : 'Usuario' }}</p>
    </div>
  `
})
export class WelcomeCard implements OnChanges {
  @Input() userName = '';
  @Input() userRole = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userName']) {
      console.log('Usuario cambió:', changes['userName'].currentValue);
    }
  }
}