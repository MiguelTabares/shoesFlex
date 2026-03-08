import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Carrito, CarritoItem } from '../models/types';
import { AuthService } from './auth.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private apiUrl = 'http://localhost:3000/api/carrito';

    // State global del carrito reactivo basado en signals
    cart = signal<Carrito | null>(null);

    // Selector computado para conteo rápido
    itemsCount = computed(() => {
        const currentCart = this.cart();
        if (!currentCart || !currentCart.items) return 0;
        return currentCart.items.reduce((acc, item) => acc + item.cantidad, 0);
    });

    totalPrice = computed(() => {
        const currentCart = this.cart();
        if (!currentCart || !currentCart.items) return 0;
        return currentCart.items.reduce((acc, item) => {
            const itemPrice = item.inventario?.producto?.precio || 0;
            return acc + (itemPrice * item.cantidad);
        }, 0);
    });

    constructor(private http: HttpClient, private authService: AuthService) { }

    private getHeaders(): HttpHeaders {
        const token = this.authService.getToken();
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    }

    async fetchCart() {
        if (!this.authService.isLoggedIn()) {
            this.cart.set(null);
            return;
        }

        try {
            const cartData = await firstValueFrom(this.http.get<Carrito>(this.apiUrl, { headers: this.getHeaders() }));
            this.cart.set(cartData);
        } catch (e) {
            console.error('Error cargando carrito:', e);
        }
    }

    async addItem(inventarioId: string, cantidad: number = 1) {
        try {
            const updatedCart = await firstValueFrom(this.http.post<Carrito>(`${this.apiUrl}/items`, {
                inventario_id: inventarioId,
                cantidad
            }, { headers: this.getHeaders() }));

            this.cart.set(updatedCart);
        } catch (e) {
            console.error('Error agregando item al carrito:', e);
            alert('Debes iniciar sesión para agregar al carrito.');
            throw e;
        }
    }

    async updateItemQuantity(itemId: string, cantidad: number) {
        try {
            const updatedCart = await firstValueFrom(this.http.put<Carrito>(`${this.apiUrl}/items/${itemId}`, {
                cantidad
            }, { headers: this.getHeaders() }));

            this.cart.set(updatedCart);
        } catch (e) {
            console.error('Error actualizando cantidad:', e);
        }
    }

    async removeItem(itemId: string) {
        try {
            const updatedCart = await firstValueFrom(this.http.delete<Carrito>(`${this.apiUrl}/items/${itemId}`, { headers: this.getHeaders() }));
            this.cart.set(updatedCart);
        } catch (e) {
            console.error('Error eliminando item:', e);
        }
    }
}
