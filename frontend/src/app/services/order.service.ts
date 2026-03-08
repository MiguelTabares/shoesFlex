import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido } from '../models/types';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private apiUrl = 'http://localhost:3000/api/pedidos';
    private http = inject(HttpClient);
    private authService = inject(AuthService);

    private getAuthHeaders() {
        const token = this.authService.getToken();
        return {
            Authorization: `Bearer ${token}`
        };
    }

    checkout(): Observable<{ message: string, pedido: Pedido }> {
        return this.http.post<{ message: string, pedido: Pedido }>(`${this.apiUrl}/checkout`, {}, { headers: this.getAuthHeaders() });
    }

    getMisPedidos(): Observable<Pedido[]> {
        return this.http.get<Pedido[]>(`${this.apiUrl}/mis-pedidos`, { headers: this.getAuthHeaders() });
    }
}
