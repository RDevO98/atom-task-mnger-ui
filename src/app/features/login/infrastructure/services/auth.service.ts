import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { LoginResponse } from '../models/login.response';
import { AuthDto } from '../../application/dto/auth.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/login`;

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: AuthDto) {
    return this.http.post<LoginResponse>(`${this.apiUrl}`, credentials);
  }

  confirm(credentials: AuthDto) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/confirm`, credentials);
  }

  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('token');
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  setToken(token: string): void {
    sessionStorage.setItem('token', token);
    this.router.navigate(['/tasks']);
  }
}
