import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private tokenKey = 'zapato_jwt_token';
    private apiUrl = 'http://localhost:3000/api/auth';

    isLoggedIn = signal<boolean>(this.hasToken());

    constructor(private http: HttpClient) { }

    login(email: string, password: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
            tap(response => {
                if (response && response.token) {
                    this.setToken(response.token);
                }
            })
        );
    }

    register(nombre: string, email: string, password: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/register`, { nombre, email, password }).pipe(
            tap(response => {
                if (response && response.token) {
                    this.setToken(response.token);
                }
            })
        );
    }

    setToken(token: string) {
        localStorage.setItem(this.tokenKey, token);
        this.isLoggedIn.set(true);
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    logout() {
        localStorage.removeItem(this.tokenKey);
        this.isLoggedIn.set(false);
    }

    getUserRole(): string {
        const token = this.getToken();
        if (!token) return '';
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.rol || '';
        } catch {
            return '';
        }
    }

    private hasToken(): boolean {
        return !!localStorage.getItem(this.tokenKey);
    }
}
