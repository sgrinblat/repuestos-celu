import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecaptchaService {

  private secretKey = '';
  private recaptchaUrl = '';

  constructor(private http: HttpClient) { }

  getTokenClientModule(token: string): Observable<any> {
    const payload = new FormData();
    payload.append('secret', this.secretKey);
    payload.append('response', token);

    return this.http.post<any>(this.recaptchaUrl, payload).pipe(
      map(response => {
        // Aquí podrías manejar la respuesta. Por ejemplo, devolver si el usuario pasó el reCAPTCHA
        return response.success && response.score > 0.5;
      }),
      catchError(err => {
        console.log('Error caught in service');
        console.error(err);
        return throwError(err);
      })
    );
  }

  verifyCaptcha(token: string, remoteIp: string): Observable<boolean> {
    const payload = new FormData();
    payload.append('secret', this.secretKey);
    payload.append('response', token);
    payload.append('remoteip', remoteIp);

    return this.http.post<any>(this.recaptchaUrl, payload).pipe(
      map(response => response.success)
    );
  }

}
