import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="cart-page animate-fade-in">
      <div class="cart-header">
        <h2>Mi Cesta de Compras</h2>
        <p class="subtitle">{{ cartService.itemsCount() }} {{ cartService.itemsCount() === 1 ? 'artículo' : 'artículos' }} en tu lista</p>
      </div>

      @if (cartService.cart()?.items?.length === 0 || !cartService.cart()) {
        <div class="empty-cart-state">
          <div class="icon-circle">🛍️</div>
          <h2>Tu cesta está vacía</h2>
          <p>Parece que no has añadido nada todavía. Explora nuestro catálogo y encuentra algo que te guste.</p>
          <a href="/" class="btn-return">Volver al Catálogo</a>
        </div>
      } @else {
        <div class="cart-layout">
          <!-- Cart Items List OR Checkout Form -->
          <div class="cart-items-container" *ngIf="!isCheckoutMode">
            @for (item of cartService.cart()?.items; track item.id) {
              <div class="cart-item-card">
                <div class="item-img-wrapper">
                  <img [src]="item.inventario?.producto?.imagen_url || 'https://via.placeholder.com/150'" [alt]="item.inventario?.producto?.nombre">
                </div>
                
                <div class="item-details">
                  <h4 class="item-brand">{{ item.inventario?.producto?.marca }}</h4>
                  <h3 class="item-name">{{ item.inventario?.producto?.nombre }}</h3>
                  
                  <div class="item-meta">
                    <span class="meta-pill">Talla EU {{ item.inventario?.talla }}</span>
                    <span class="meta-pill color">{{ item.inventario?.producto?.color }}</span>
                  </div>
                </div>

                <div class="item-price">
                  <p>\${{ item.inventario?.producto?.precio }}</p>
                </div>

                <div class="item-controls">
                  <div class="qty-control">
                    <button class="qty-btn" (click)="changeQty(item.id, item.cantidad - 1)" [disabled]="item.cantidad <= 1">−</button>
                    <span class="qty-display">{{ item.cantidad }}</span>
                    <button class="qty-btn" (click)="changeQty(item.id, item.cantidad + 1)">+</button>
                  </div>
                  
                  <button class="btn-remove" (click)="removeItem(item.id)" title="Eliminar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                  </button>
                </div>
              </div>
            }
          </div>

          <!-- CHECKOUT FORM -->
          <div class="checkout-form-container" *ngIf="isCheckoutMode">
             <div class="checkout-card">
                <h3>Detalles de Envío (Pago Contraentrega)</h3>
                <p>Por favor completa los detalles para enviar tu pedido. Pagarás al recibir tus productos.</p>
                
                <form #checkoutForm="ngForm" class="auth-form mt">
                    <div class="form-group">
                        <label>Dirección de Entrega</label>
                        <input type="text" [(ngModel)]="shipping.address" name="address" required class="modern-input massive" placeholder="Ej. Calle 123 #45-67">
                    </div>
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Ciudad</label>
                            <input type="text" [(ngModel)]="shipping.city" name="city" required class="modern-input massive" placeholder="Ciudad">
                        </div>
                        <div class="form-group">
                            <label>Teléfono</label>
                            <input type="text" [(ngModel)]="shipping.phone" name="phone" required class="modern-input massive" placeholder="Tu número">
                        </div>
                    </div>
                </form>

                <button class="btn-return mt" (click)="isCheckoutMode = false">← Volver al carrito</button>
             </div>
          </div>
          
          <!-- Summary Sidebar -->
          <div class="order-summary">
            <h3>{{ isCheckoutMode ? 'Confirmación' : 'Resumen del Pedido' }}</h3>
            
            <div class="summary-line">
              <span>Subtotal</span>
              <span class="val">\${{ cartService.totalPrice() }}</span>
            </div>
            <div class="summary-line">
              <span>Envío <span class="badge-free">Gratis Vértice</span></span>
              <span class="val">$0.00</span>
            </div>
            
            <div class="summary-divider"></div>
            
            <div class="summary-total">
              <span>Total a pagar</span>
              <span class="total-val">\${{ cartService.totalPrice() }}</span>
            </div>

            <button *ngIf="!isCheckoutMode" class="btn-checkout" (click)="isCheckoutMode = true">Continuar con el Pago ➔</button>
            
            <button *ngIf="isCheckoutMode" class="btn-checkout finish-btn" [disabled]="isProcessing || !shipping.address || !shipping.city || !shipping.phone" (click)="processOrder()">
                <span *ngIf="!isProcessing">Confirmar Pedido ➔</span>
                <span *ngIf="isProcessing">Procesando...</span>
            </button>

            <div class="secure-checkout">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <span>Pago Seguro Contraentrega. Pide ahora, paga al recibir.</span>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartService = inject(CartService);
  orderService = inject(OrderService);
  router = inject(Router);

  isCheckoutMode = false;
  isProcessing = false;

  shipping = {
    address: '',
    city: '',
    phone: ''
  };

  ngOnInit() {
    this.cartService.fetchCart();
  }

  changeQty(itemId: string, newQty: number) {
    this.cartService.updateItemQuantity(itemId, newQty);
  }

  removeItem(itemId: string) {
    this.cartService.removeItem(itemId);
  }

  processOrder() {
    if (!this.shipping.address || !this.shipping.city || !this.shipping.phone) {
      alert('Por favor completa todos los datos de envío');
      return;
    }

    this.isProcessing = true;
    this.orderService.checkout().subscribe({
      next: (res) => {
        this.isProcessing = false;
        alert('¡Pedido Confirmado! ' + res.message);
        this.cartService.fetchCart(); // Limpia estado en el frontend
        this.router.navigate(['/orders']); // A historial
      },
      error: (err) => {
        this.isProcessing = false;
        alert('Ocurrió un error: ' + (err.error?.message || err.message));
      }
    })
  }
}
