import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConexionService {
  private baseUrl = 'https://admin.repuestoscelu.com.ar/api'; // URL base del API
  private token = 'OTBmNGMxZjQtZjFmNS0xMWVlLWE4MzMtNjNlZjBlOGM3YjI1OmM4M2ExNDYxLWM5NDQtNDc4NS1iMzc2LWI0Njc0YzI2YmQ2Zg=='; // Token fijo
  private headers = new HttpHeaders({
    'Authorization': `Bearer ${this.token}`
  });

  constructor(private http: HttpClient) { }

  // Función para obtener los estados
  getStates(): Observable<any> {
    return this.http.get(`${this.baseUrl}/front/states`, { headers: this.headers });
  }

  getCities(idState: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/front/cities/${idState}`, { headers: this.headers });
  }

  registrarUsuario(userData: any): Observable<any> {
    const url = `${this.baseUrl}/front/register`;
    return this.http.post<any>(url, userData, { headers: this.headers });
  }

  validarCodigo(email: string, validationCode: number): Observable<any> {
    const url = `${this.baseUrl}/front/validate`;
    const body = {
      email: email,
      validation_code: validationCode
    };
    return this.http.post<any>(url, body, { headers: this.headers });
  }


}
