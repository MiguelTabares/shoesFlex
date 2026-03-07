import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <main>
      <header>
        <h1>ZapatoFlex - MVP</h1>
        <p>Estado del Carrito: {{ cartCount() }} ítems</p>
        <button (click)="addToCart()">Agregar al carrito</button>
      </header>
      <section class="content">
        <router-outlet></router-outlet>
      </section>
    </main>
  `,
  styles: [`
    main { padding: 20px; font-family: Arial, sans-serif; }
    header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #ccc; padding-bottom: 20px; }
    button { padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; }
    button:hover { background-color: #0056b3; }
    .content { margin-top: 20px; }
  `]
})
export class AppComponent {
  title = 'ZapatoFlex Frontend';

  // Utilizando Signals para el estado
  cartCount = signal(0);

  addToCart() {
    this.cartCount.update(count => count + 1);
  }
}
