import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Producto } from '../../models/types';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="catalog-page animate-fade-in">
      <div class="hero-section">
        <div class="hero-content">
          <h1>Pisa Fuerte, <br><span class="highlight">Camina Lejos.</span></h1>
          <p>Explora nuestra más reciente colección de calzado diseñada para llevarte a cualquier lugar.</p>
        </div>
      </div>

      <div class="catalog-container">
        <!-- Sidebar Filters -->
        <aside class="filters-sidebar">
          <div class="filter-group">
            <h3>Filtrar Catálogo</h3>
            
            <label class="filter-label">Por Categoría</label>
            <div class="custom-select-wrapper">
              <select [(ngModel)]="filters.categoria" (change)="loadProducts()" class="custom-select">
                <option value="">🔥 Todas las categorías</option>
                <option value="DEPORTIVO">🏃‍♂️ Deportivo</option>
                <option value="CASUAL">✨ Casual</option>
                <option value="FORMAL">👔 Formal</option>
              </select>
            </div>

            <label class="filter-label">Por Color</label>
            <input type="text" [(ngModel)]="filters.color" (keyup.enter)="loadProducts()" placeholder="Ej. Negro, Rojo, Blanco" class="filter-input" />

            <label class="filter-label">Tu Talla (EU)</label>
            <input type="text" [(ngModel)]="filters.talla" (keyup.enter)="loadProducts()" placeholder="Ej. 40, 42" class="filter-input" />

            <label class="filter-label">Hasta: \${{ filters.precioMax }} USD</label>
            <input type="range" [(ngModel)]="filters.precioMax" min="20" max="300" step="10" (change)="loadProducts()" class="range-slider" />
          </div>
        </aside>

        <!-- Products Grid -->
        <section class="products-area">
          <div class="grid-header">
            <h2>Resultados ({{ products().length }})</h2>
          </div>
          
          @if (products().length === 0) {
            <div class="empty-state">
              <span class="icon">👟</span>
              <h3>No encontramos qué ponerte hoy</h3>
              <p>Intenta quitando algunos filtros para ver más resultados.</p>
            </div>
          } @else {
            <div class="products-grid">
              @for (product of products(); track product.id) {
                <div class="product-card">
                  <div class="card-image-box">
                    <img [src]="product.imagen_url || 'https://via.placeholder.com/300x300.png?text=Sin+Imagen'" [alt]="product.nombre" class="product-img" loading="lazy">
                    <span class="category-badge">{{ product.categoria }}</span>
                  </div>
                  
                  <div class="card-body">
                    <p class="product-brand">{{ product.marca }}</p>
                    <h3 class="product-name">{{ product.nombre }}</h3>
                    <p class="product-price">\${{ product.precio }}</p>
                    <p class="product-color">{{ product.color }}</p>
                    
                    @if (product.inventarios && product.inventarios.length > 0) {
                      <div class="actions-group">
                        <select #tallaSelect class="size-select">
                          <option value="" disabled selected>Talla</option>
                          @for (inv of product.inventarios; track inv.id) {
                            <option [value]="inv.id" [disabled]="inv.stock <= 0">
                              EU {{ inv.talla }} {{ inv.stock === 0 ? '(Agotado)' : '' }}
                            </option>
                          }
                        </select>
                        <button class="btn-add" (click)="addToCart(tallaSelect.value)">
                          <span>+</span> Carrito
                        </button>
                      </div>
                    } @else {
                      <div class="sold-out-box">Agotado Global</div>
                    }
                  </div>
                </div>
              }
            </div>
          }
        </section>
      </div>
    </div>
  `,
  styleUrl: './catalog.component.css'
})
export class CatalogComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  products = signal<Producto[]>([]);

  filters = {
    categoria: '',
    color: '',
    talla: '',
    precioMax: 300
  };

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    const activeFilters: any = {};
    if (this.filters.categoria) activeFilters.categoria = this.filters.categoria;
    if (this.filters.color) activeFilters.color = this.filters.color;
    if (this.filters.talla) activeFilters.talla = this.filters.talla;
    if (this.filters.precioMax < 300) activeFilters.precioMax = this.filters.precioMax;

    this.productService.getProducts(activeFilters).subscribe({
      next: (data) => this.products.set(data),
      error: (err) => console.error('Error fetching catalog', err)
    });
  }

  async addToCart(inventarioId: string) {
    if (!inventarioId || inventarioId === 'Talla') {
      alert("Por favor selecciona una talla");
      return;
    }

    try {
      await this.cartService.addItem(inventarioId, 1);
      alert('¡Zapatos añadidos al carrito con éxito! 🛒');
    } catch (e) {
      // Errors are already handled in CartService
    }
  }
}
