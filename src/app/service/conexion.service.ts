import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Producto } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ConexionService {
  private baseUrl = 'https://admin.repuestoscelu.com.ar/api'; // URL base del API
  private token = 'OTBmNGMxZjQtZjFmNS0xMWVlLWE4MzMtNjNlZjBlOGM3YjI1OmM4M2ExNDYxLWM5NDQtNDc4NS1iMzc2LWI0Njc0YzI2YmQ2Zg=='; // Token fijo
  private headers = new HttpHeaders({
    'Authorization': `Bearer ${this.token}`
  });

  private tokenUsuario = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem("tokenUser")}`
  });

  constructor(private http: HttpClient) { }

  // Función para obtener los estados
  getStates(): Observable<any> {
    return this.http.get(`${this.baseUrl}/front/states`, { headers: this.headers });
  }

  getCities(idState: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/front/cities/${idState}`, { headers: this.headers });
  }


  getSalesPoints(): Observable<any> {
    return this.http.get(`${this.baseUrl}/front/sales_points`, { headers: this.headers });
  }

  getMenuCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/front/menu_categories`, { headers: this.headers });
  }

  getProductsCarrusel(): Observable<any> {
    return this.http.get(`${this.baseUrl}/front/products`, { headers: this.headers });
  }

  getProductById(productId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/front/product/${productId}`, { headers: this.headers });
  }

  getProductoBySearching(k?: string, c?: number, sc?: number, s?: number, ci?: number, t?: string, l?: number): Observable<any> {
    let params = new HttpParams();
    if (k) params = params.set('k', k);
    if (c) params = params.set('c', c.toString());
    if (sc) params = params.set('sc', sc.toString());
    if (s) params = params.set('s', s.toString());
    if (ci) params = params.set('ci', ci.toString());
    if (t) params = params.set('t', t);
    if (l) params = params.set('l', l.toString());

    return this.http.get(`${this.baseUrl}/front/products/search`, { params: params, headers: this.headers });
  }



  registrarUsuario(userData: any): Observable<any> {
    const url = `${this.baseUrl}/front/register`;
    return this.http.post<any>(url, userData, { headers: this.headers });
  }

  validarCodigo(email: string, validationCode: number, recaptchaToken: string): Observable<any> {
    const url = `${this.baseUrl}/front/validate`;
    const body = {
      email: email,
      validation_code: validationCode,
      recaptcha_token: recaptchaToken
    };
    return this.http.post<any>(url, body, { headers: this.headers });
  }

  revalidarCodigo(email: string, codeArea: number, celPhone: number, recaptchaToken: string): Observable<any> {
    const url = `${this.baseUrl}/front/new_validation_code`;
    const body = {
      email: email,
      code_area: codeArea,
      cel_phone: celPhone,
      recaptcha_token: recaptchaToken
    };
    return this.http.post<any>(url, body, { headers: this.headers });
  }


  getFavoriteList(): Observable<Producto[]> {
    console.log(this.tokenUsuario);

    return this.http.get<{ favorite_list: Producto[] }>(`${this.baseUrl}/customer/favorite/list`, { headers: this.tokenUsuario })
      .pipe(
        map(response => response.favorite_list || [])
      );
  }

  agregarProductoFavorito(productId: number): Observable<any> {
    console.log(this.tokenUsuario);
    const body = {
      product_id: productId
    };
    return this.http.post(`${this.baseUrl}/customer/favorite/add`, body, { headers: this.tokenUsuario });
  }

  quitarProductoFavorito(productId: number): Observable<any> {
    const body = {
      product_id: productId
    };
    return this.http.post(`${this.baseUrl}/customer/favorite/remove`, body, { headers: this.tokenUsuario });
  }

  eliminarFavoritos(): Observable<any> {
    return this.http.post(`${this.baseUrl}/customer/favorite/removeAll`, { headers: this.tokenUsuario });
  }



  getCarritoList(): Observable<Producto[]> {
    console.log(this.tokenUsuario);

    return this.http.get<{ shop_cart_list: Producto[] }>(`${this.baseUrl}/customer/cart/list`, { headers: this.tokenUsuario })
      .pipe(
        map(response => response.shop_cart_list || [])
      );
  }

  agregarProductoCarrito(productId: number): Observable<any> {
    console.log(this.tokenUsuario);
    const body = {
      product_id: productId
    };
    return this.http.post(`${this.baseUrl}/customer/cart/add`, body, { headers: this.tokenUsuario });
  }

  quitarProductoCarrito(productId: number): Observable<any> {
    const body = {
      product_id: productId
    };
    return this.http.post(`${this.baseUrl}/customer/cart/remove`, body, { headers: this.tokenUsuario });
  }

  eliminarCarrito(): Observable<any> {
    return this.http.post(`${this.baseUrl}/customer/cart/removeAll`, { headers: this.tokenUsuario });
  }

  agregarTodoFavoritos(): Observable<any> {
    return this.http.post(`${this.baseUrl}/customer/cart/addAllFavorites`, { headers: this.tokenUsuario });
  }










  // METODOS SOBRE INICIO DE SESIÓN

  // loginUsuario(email: string, password: string, recaptchaToken: string): Observable<any> {
  //   const url = `${this.baseUrl}/front/login`;
  //   const body = {
  //     email: email,
  //     password: password,
  //     recaptcha_token: recaptchaToken
  //   };
  //   return this.http.post(url, body, { headers: this.headers });
  // }

  // sesionIniciada() {
  //   const tokenStr = localStorage.getItem('token');

  //   if (tokenStr == undefined || tokenStr == '' || tokenStr == null) {
  //     return false;
  //   } else {
  //     const payload = JSON.parse(atob(tokenStr.split('.')[1]));
  //     const currentTime = Math.floor(Date.now() / 1000);

  //     if (payload.exp < currentTime) {
  //       // El token ha expirado, desloguear al usuario
  //       this.deslogear();
  //       return false;
  //     } else {
  //       return true;
  //     }
  //   }
  // }


  // getToken() {
  //   return localStorage.getItem("token");
  // }


  // deslogear() {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("userData");
  //   return true;
  // }

}
