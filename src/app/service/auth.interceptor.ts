import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Aplica el token solo para endpoints que requieren el token de usuario
    if (req.url.includes("/customer/")) {  // Asumiendo que todos los endpoints bajo "/front/" requieren el token de usuario
      const tokenUser = this.authService.getToken();
      if (tokenUser) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${tokenUser}`
          }
        });
      }
    }
    return next.handle(req);
  }
}
