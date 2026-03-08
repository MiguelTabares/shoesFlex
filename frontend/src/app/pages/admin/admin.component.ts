import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { Producto, Inventario, CategoriaProducto } from '../../models/types';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './admin.component.html',
    styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
    authService = inject(AuthService);
    productService = inject(ProductService);
    http = inject(HttpClient);
    router = inject(Router);

    adminRole = this.authService.getUserRole();
    activeTab: 'productos' | 'inventario' | 'pedidos' = 'productos';

    // Status
    isLoading = false;

    // Productos
    productos: Producto[] = [];
    showProductForm = false;
    currentProduct: Partial<Producto> = this.resetProductForm();
    categorias = Object.values(CategoriaProducto);

    // Inventarios
    inventarios: Inventario[] = [];
    selectedProductIdForInventory = '';
    showInventoryForm = false;
    currentInventory: Partial<Inventario> = { talla: '', stock: 0 };

    // Pedidos (Mocked)
    pedidos = [
        { id: 'PD-0001', usuario: 'Juan Perez', total: 154.99, estado: 'PAGADO', fecha: '2026-03-01' },
        { id: 'PD-0002', usuario: 'Maria DB', total: 89.00, estado: 'ENVIADO', fecha: '2026-03-05' },
        { id: 'PD-0003', usuario: 'Carlos V', total: 220.50, estado: 'ENTREGADO', fecha: '2026-02-28' },
    ];

    ngOnInit() {
        if (this.adminRole !== 'ADMIN') {
            this.router.navigate(['/']); // Protección adicional
        }
        this.loadProducts();
    }

    goHome() {
        this.router.navigate(['/']);
    }

    // --- PRODUCT LOGIC ---

    async loadProducts() {
        this.isLoading = true;
        try {
            this.productos = await firstValueFrom(this.productService.getProducts());
        } catch (error) {
            console.error('Error fetching products:', error);
        }
        this.isLoading = false;
    }

    resetProductForm() {
        return {
            nombre: '', descripcion: '', precio: 0, marca: '', color: '',
            categoria: CategoriaProducto.CASUAL, imagen_url: ''
        };
    }

    openCreateProduct() {
        this.currentProduct = this.resetProductForm();
        this.showProductForm = true;
    }

    openEditProduct(prod: Producto) {
        this.currentProduct = { ...prod };
        this.showProductForm = true;
    }

    async saveProduct() {
        if (!this.currentProduct.nombre || !this.currentProduct.precio) return alert('Nombre y precio Obligatorios');

        try {
            if (this.currentProduct.id) {
                await firstValueFrom(this.productService.updateProduct(this.currentProduct.id, this.currentProduct));
            } else {
                await firstValueFrom(this.productService.createProduct(this.currentProduct));
            }
            this.showProductForm = false;
            this.loadProducts();
            if (this.activeTab === 'inventario') this.loadInventoryForProduct(); // Refresh si estaba ahí
        } catch (error) {
            alert('Error guardando producto');
        }
    }

    async deleteProduct(id: string) {
        if (confirm('¿Seguro que deseas eliminar este producto y todo su inventario?')) {
            try {
                await firstValueFrom(this.productService.deleteProduct(id));
                this.loadProducts();
            } catch (error) {
                alert('No se pudo eliminar el producto');
            }
        }
    }

    // --- INVENTORY LOGIC ---

    onProductSelectForInventory() {
        this.loadInventoryForProduct();
    }

    async loadInventoryForProduct() {
        if (!this.selectedProductIdForInventory) {
            this.inventarios = [];
            return;
        }
        try {
            this.inventarios = await firstValueFrom(this.http.get<Inventario[]>(`${environment.apiUrl}/inventario/producto/${this.selectedProductIdForInventory}`));
        } catch (error) {
            console.error('Error fetching inventory');
        }
    }

    openAddInventory() {
        this.currentInventory = { talla: '', stock: 0 };
        this.showInventoryForm = true;
    }

    openEditInventory(inv: Inventario) {
        this.currentInventory = { ...inv };
        this.showInventoryForm = true;
    }

    private getAuthHeaders() {
        return { headers: { Authorization: `Bearer ${this.authService.getToken()}` } };
    }

    async saveInventory() {
        if (!this.selectedProductIdForInventory) return alert('Selecciona un producto');

        try {
            const payload = {
                producto_id: this.selectedProductIdForInventory,
                talla: this.currentInventory.talla,
                stock: this.currentInventory.stock
            };

            if (this.currentInventory.id) {
                await firstValueFrom(this.http.put(`${environment.apiUrl}/inventario/${this.currentInventory.id}`, payload, this.getAuthHeaders()));
            } else {
                await firstValueFrom(this.http.post(`${environment.apiUrl}/inventario`, payload, this.getAuthHeaders()));
            }
            this.showInventoryForm = false;
            this.loadInventoryForProduct();
        } catch (error) {
            alert('Error guardando inventario');
        }
    }

    async deleteInventory(id: string) {
        if (confirm('¿Eliminar esta talla del stock?')) {
            try {
                await firstValueFrom(this.http.delete(`${environment.apiUrl}/inventario/${id}`, this.getAuthHeaders()));
                this.loadInventoryForProduct();
            } catch (error) {
                alert('No se pudo eliminar inventario');
            }
        }
    }
}
