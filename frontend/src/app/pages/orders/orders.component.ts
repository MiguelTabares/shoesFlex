import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { Pedido } from '../../models/types';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe],
  template: `
    <div class="orders-page animate-fade-in">
        <div class="orders-header">
            <h2>Mis Compras</h2>
            <p>Aquí encontrarás el historial de los pedidos que has realizado.</p>
        </div>

        <div *ngIf="isLoading" class="loading-state">
            <span class="loader"></span>
            <p>Cargando tus pedidos...</p>
        </div>

        <div *ngIf="!isLoading && pedidos.length === 0" class="empty-state">
            <div class="icon-circle">📦</div>
            <h2>Aún no tienes pedidos</h2>
            <p>Parece que no has comprado nada recientemente.</p>
            <a href="/" class="btn-return">Explorar Catálogo</a>
        </div>

        <div class="orders-list" *ngIf="!isLoading && pedidos.length > 0">
            <div class="order-card" *ngFor="let pedido of pedidos">
                <div class="order-header">
                    <div class="order-meta">
                        <div>
                            <span class="label">Pedido Realizado</span>
                            <span class="value">{{ pedido.fecha_pedido | date:'longDate' }}</span>
                        </div>
                        <div>
                            <span class="label">Total a Pagar</span>
                            <span class="value">\${{ pedido.total }}</span>
                        </div>
                        <div>
                            <span class="label">Método</span>
                            <span class="value">Contraentrega</span>
                        </div>
                    </div>
                    <div class="order-id">
                        <span class="label">ID Pedido</span>
                        <span class="value">#{{ pedido.id.split('-')[0] | uppercase }}</span>
                    </div>
                </div>
                
                <div class="order-body">
                    <div class="order-status">
                        <h3>Estado Acutal</h3>
                        <span class="status-badge" [ngClass]="pedido.estado.toLowerCase()">
                            {{ pedido.estado }}
                        </span>
                        <p class="status-desc" *ngIf="pedido.estado === 'PAGADO'">Tu pedido está siendo preparado para envío.</p>
                    </div>

                    <div class="order-items">
                        <div class="item-row" *ngFor="let item of pedido.items">
                            <div class="item-img" [style.backgroundImage]="'url(' + (item.inventario?.producto?.imagen_url || 'https://via.placeholder.com/150') + ')'"></div>
                            <div class="item-details">
                                <a href="#">{{ item.inventario?.producto?.nombre }}</a>
                                <div class="item-meta">
                                    <span>Talla: {{ item.inventario?.talla }}</span>
                                    <span>Color: {{ item.inventario?.producto?.color }}</span>
                                </div>
                                <div class="item-price">
                                    <span><strong>\${{ item.precio_unitario }}</strong> x {{ item.cantidad }} uds.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  `,
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  orderService = inject(OrderService);
  pedidos: Pedido[] = [];
  isLoading = true;

  ngOnInit() {
    this.fetchPedidos();
  }

  fetchPedidos() {
    this.orderService.getMisPedidos().subscribe({
      next: (data) => {
        this.pedidos = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }
}
