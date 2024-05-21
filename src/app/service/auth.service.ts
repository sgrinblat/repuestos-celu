import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://admin.repuestoscelu.com.ar/api'; // Asegúrate de tener la URL base correcta
  private token = 'OTBmNGMxZjQtZjFmNS0xMWVlLWE4MzMtNjNlZjBlOGM3YjI1OmM4M2ExNDYxLWM5NDQtNDc4NS1iMzc2LWI0Njc0YzI2YmQ2Zg=='; // Token fijo
  private headers = new HttpHeaders({
    'Authorization': `Bearer ${this.token}`
  });

  constructor(private http: HttpClient) { }

  // Método para iniciar sesión
  loginUsuario(email: string, password: string, recaptchaToken: string): Observable<any> {
    const url = `${this.baseUrl}/front/login`;
    const body = {
      email: email,
      password: password,
      recaptcha_token: recaptchaToken
    };
    return this.http.post(url, body, { headers: this.headers });
  }

  // Método para verificar si la sesión está activa
  sesionIniciada(): boolean {
    const token = localStorage.getItem('tokenUser');
    if (!token) {
      return false;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp < currentTime) {
      this.deslogear();
      return false;
    }
    return true;
  }

  // Método para obtener el token almacenado
  getToken(): string | null {
    return localStorage.getItem('tokenUser');
  }


  // Método para cerrar sesión
  deslogear() {
    localStorage.removeItem('tokenUser');
    localStorage.removeItem('userData');
  }

  // Guardar token en localStorage
  saveToken(token: string): void {
    localStorage.setItem('tokenUser', token);
  }
}
