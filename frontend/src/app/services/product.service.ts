import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/types';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiUrl = 'http://localhost:3000/api/products';

    constructor(private http: HttpClient) { }

    getProducts(filters?: any): Observable<Producto[]> {
        let params = new HttpParams();

        if (filters) {
            if (filters.categoria) params = params.set('categoria', filters.categoria);
            if (filters.marca) params = params.set('marca', filters.marca);
            if (filters.color) params = params.set('color', filters.color);
            if (filters.talla) params = params.set('talla', filters.talla);
            if (filters.precioMin) params = params.set('precioMin', filters.precioMin);
            if (filters.precioMax) params = params.set('precioMax', filters.precioMax);
        }

        return this.http.get<Producto[]>(this.apiUrl, { params });
    }

    getProductById(id: string): Observable<Producto> {
        return this.http.get<Producto>(`${this.apiUrl}/${id}`);
    }

    private getAuthHeaders() {
        const token = localStorage.getItem('zapato_jwt_token');
        return {
            Authorization: `Bearer ${token}`
        };
    }

    createProduct(producto: Partial<Producto>): Observable<Producto> {
        return this.http.post<Producto>(this.apiUrl, producto, { headers: this.getAuthHeaders() });
    }

    updateProduct(id: string, producto: Partial<Producto>): Observable<Producto> {
        return this.http.put<Producto>(`${this.apiUrl}/${id}`, producto, { headers: this.getAuthHeaders() });
    }

    deleteProduct(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
    }
}
