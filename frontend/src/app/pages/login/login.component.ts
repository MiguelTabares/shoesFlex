import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-page animate-fade-in">
      <div class="login-container">
        <!-- Decoration side -->
        <div class="login-brand-side">
          <div class="brand-content">
            <h1>{{ isRegistering ? 'Empieza tu viaje.' : 'Bienvenido de vuelta.' }}</h1>
            <p>{{ isRegistering 
              ? 'Crea una cuenta para realizar compras, guardar tus favoritos y disfrutar de envíos rápidos en ZapatoFlex.' 
              : 'Accede a tu cuenta para gestionar tu carrito, ver nuevos lanzamientos y disfrutar la experiencia ZapatoFlex.' 
            }}</p>
          </div>
        </div>

        <!-- Form side -->
        <div class="login-form-side">
          <div class="form-wrapper">
            <h2>{{ isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión' }}</h2>
            <p class="subtitle">{{ isRegistering ? 'Únete a ZapatoFlex hoy mismo' : 'Ingresa tus credenciales para continuar' }}</p>

            <form (ngSubmit)="onSubmit()" #loginForm="ngForm" class="auth-form">
              
              <div class="input-group" *ngIf="isRegistering">
                <label for="nombre">Nombre Completo</label>
                <div class="input-icon-wrapper">
                  <span class="icon">👤</span>
                  <input 
                    type="text" 
                    id="nombre" 
                    name="nombre" 
                    [(ngModel)]="credentials.nombre" 
                    [required]="isRegistering"
                    placeholder="Tu nombre"
                  >
                </div>
              </div>

              <div class="input-group">
                <label for="email">Correo Electrónico</label>
                <div class="input-icon-wrapper">
                  <span class="icon">✉️</span>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    [(ngModel)]="credentials.email" 
                    required 
                    placeholder="ejemplo@correo.com"
                  >
                </div>
              </div>

              <div class="input-group">
                <label for="password">Contraseña</label>
                <div class="input-icon-wrapper">
                  <span class="icon">🔒</span>
                  <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    [(ngModel)]="credentials.password" 
                    required 
                    placeholder="••••••••"
                  >
                </div>
              </div>

              @if (errorMessage) {
                <div class="error-message">
                  {{ errorMessage }}
                </div>
              }

              @if (successMessage) {
                <div class="success-message">
                  {{ successMessage }}
                </div>
              }

              <button type="submit" class="btn-submit" [disabled]="!loginForm.form.valid || isLoading">
                <span *ngIf="!isLoading">{{ isRegistering ? 'Registrarme' : 'Ingresar' }} ➔</span>
                <span *ngIf="isLoading" class="loader"></span>
              </button>

            </form>
            
            <div class="register-prompt">
              {{ isRegistering ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?' }}
              <a href="#" (click)="toggleMode($event)">
                {{ isRegistering ? 'Inicia sesión aquí' : 'Regístrate aquí' }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  authService = inject(AuthService);
  cartService = inject(CartService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  credentials = {
    nombre: '',
    email: '',
    password: ''
  };

  errorMessage = '';
  successMessage = '';
  isLoading = false;
  isRegistering = false;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['mode'] === 'register') {
        this.isRegistering = true;
      } else {
        this.isRegistering = false;
      }
      this.errorMessage = '';
    });
  }

  toggleMode(event: Event) {
    event.preventDefault();
    this.isRegistering = !this.isRegistering;
    this.errorMessage = '';
    this.successMessage = '';
  }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    // Validar formato de email para evitar el uso de usernames
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.credentials.email)) {
      this.errorMessage = 'Debes utilizar tu dirección de correo electrónico válido, no un nombre de usuario.';
      return;
    }

    this.isLoading = true;

    const authObs = this.isRegistering
      ? this.authService.register(this.credentials.nombre, this.credentials.email, this.credentials.password)
      : this.authService.login(this.credentials.email, this.credentials.password);

    authObs.subscribe({
      next: () => {
        this.isLoading = false;

        if (this.isRegistering) {
          this.successMessage = 'Usuario creado exitosamente. Ingresando...';
        }

        setTimeout(() => {
          this.cartService.fetchCart(); // Recargar el carrito automáticamente tras login
          const role = this.authService.getUserRole();
          if (role === 'ADMIN') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/']); // Redirigir al inicio/catálogo
          }
        }, this.isRegistering ? 1500 : 0);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || (this.isRegistering ? 'Error al registrarte. Intenta con otro correo.' : 'Error al iniciar sesión. Verifica tus credenciales.');
      }
    });
  }
}
