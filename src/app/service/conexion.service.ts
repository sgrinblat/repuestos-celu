import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { Observable, Subject } from 'rxjs';
import { Carta } from '../carta';
import { Expansion } from '../expansion';
import { Rareza } from '../rareza';
import { Tipo } from '../tipo';
import { Usuario } from '../usuario';

@Injectable({
  providedIn: 'root'
})
export class ConexionService {

  public loginStatus = new Subject<boolean>();
  private urlBasica = "http://89.116.225.248:8080"

  private cartaURL = `${this.urlBasica}/carta/cartas`;
  private expansionURL = `${this.urlBasica}/expansion/expansiones`
  private rarezaURL = `${this.urlBasica}/rareza/rarezas`
  private tipoURL = `${this.urlBasica}/tipo/tipos`
  private usuarioURL = `${this.urlBasica}/usuarios/user/`
  private tokenURL = `${this.urlBasica}/generate-token`
  private tokenObtenerUserURL = `${this.urlBasica}/actual-usuario`

  constructor(private httpClient: HttpClient) { }

  // este método nos sirve para obtener todas las cartas subidas
  getTodasLasCartas():Observable<Carta[]> {
    return this.httpClient.get<Carta[]>(`${this.cartaURL}`);
  }

  // este método nos sirve para obtener todas las cartas subidas
  getTodasLasCartasOrdenadas():Observable<Carta[]> {
    return this.httpClient.get<Carta[]>(`${this.cartaURL}/ordenadas`);
  }

  // este método nos sirve para ver una carta por su ID
  getCartaById(id:number): Observable<Carta> {
    return this.httpClient.get<Carta>(`${this.cartaURL}/${id}`);
  }

  // este método nos sirve para ver una carta por una parte de su nombre
  getCartaByPartialName(nombre: string): Observable<Carta> {
    return this.httpClient.get<Carta>(`${this.cartaURL}/nombre/${nombre}`);
  }

  // este método nos sirve para buscar una carta por su coste
  getCartaByCoste(coste: number): Observable<Carta[]> {
    return this.httpClient.get<Carta[]>(`${this.cartaURL}/coste/${coste}`);
  }

  // este método nos sirve para buscar una carta por expansion
  getCartaByExpansion(id: number): Observable<Carta[]> {
    return this.httpClient.get<Carta[]>(`${this.cartaURL}/expansion/${id}`);
  }

  countCartaByExpansion(id: number): Observable<number> {
    return this.httpClient.get<number>(`${this.cartaURL}/expansion/contar/${id}`);
  }

  // este método nos sirve para buscar una carta por rareza
  getCartaByRareza(id: number): Observable<Carta[]> {
    return this.httpClient.get<Carta[]>(`${this.cartaURL}/rareza/${id}`);
  }

  // este método nos sirve para buscar una carta por tipo
  getCartaByTipo(id: number): Observable<Carta[]> {
    return this.httpClient.get<Carta[]>(`${this.cartaURL}/tipo/${id}`);
  }

  // este método nos sirve para registrar una carta
  postCarta(carta: Carta) : Observable<Object> {
    return this.httpClient.post(`${this.cartaURL}/crear`, carta);
  }

  deleteCarta(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.cartaURL}/eliminar/${id}`);
  }

  putCarta(id: number, carta: Carta, ): Observable<Object> {
    return this.httpClient.put(`${this.cartaURL}/actualizar/${id}`, carta);
  }

  // ---------------------- EXPANSIONES ----------------------

  getTodasLasExpas():Observable<Expansion[]> {
    return this.httpClient.get<Expansion[]>(`${this.expansionURL}`);
  }

  getExpaById(id:number): Observable<Expansion> {
    return this.httpClient.get<Expansion>(`${this.expansionURL}/${id}`);
  }

  getExpaByName(nombre: string): Observable<Expansion> {
    return this.httpClient.get<Expansion>(`${this.expansionURL}/nombre/${nombre}`);
  }

  // este método nos sirve para registrar una expansion
  postExpansion(expansion: Expansion) : Observable<Object> {
    return this.httpClient.post(`${this.expansionURL}/crear`, expansion);
  }

  deleteExpansion(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.expansionURL}/eliminar/${id}`);
  }

  putExpansion(id: number, expansion: Expansion, ): Observable<Object> {
    return this.httpClient.put(`${this.expansionURL}/actualizar/${id}`, expansion);
  }

  // ---------------------- RAREZAS ----------------------

  getTodasLasRarezas():Observable<Rareza[]> {
    return this.httpClient.get<Rareza[]>(`${this.rarezaURL}`);
  }

  getRarezaById(id:number): Observable<Rareza> {
    return this.httpClient.get<Rareza>(`${this.rarezaURL}/${id}`);
  }

  getRarezaByName(nombre: string): Observable<Rareza> {
    return this.httpClient.get<Rareza>(`${this.rarezaURL}/nombre/${nombre}`);
  }

  // este método nos sirve para registrar una expansion
  postRareza(rareza: Rareza) : Observable<Object> {
    return this.httpClient.post(`${this.rarezaURL}/crear`, rareza);
  }

  deleteRareza(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.rarezaURL}/eliminar/${id}`);
  }

  putRareza(id: number, rareza: Rareza, ): Observable<Object> {
    return this.httpClient.put(`${this.rarezaURL}/actualizar/${id}`, rareza);
  }

  // ---------------------- TIPOS ----------------------

  getTodasLosTipos():Observable<Tipo[]> {
    return this.httpClient.get<Tipo[]>(`${this.tipoURL}`);
  }

  getTipoById(id:number): Observable<Tipo> {
    return this.httpClient.get<Tipo>(`${this.tipoURL}/${id}`);
  }

  getTipoByName(nombre: string): Observable<Tipo> {
    return this.httpClient.get<Tipo>(`${this.tipoURL}/nombre/${nombre}`);
  }

  // este método nos sirve para registrar una expansion
  postTipo(tipo: Tipo) : Observable<Object> {
    return this.httpClient.post(`${this.tipoURL}/crear`, tipo);
  }

  deleteTipo(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.tipoURL}/eliminar/${id}`);
  }

  putTipo(id: number, tipo: Tipo, ): Observable<Object> {
    return this.httpClient.put(`${this.tipoURL}/actualizar/${id}`, tipo);
  }

  // ---------------------- USUARIOS ----------------------

  postUsuario(user: Usuario) : Observable<Object> {
    return this.httpClient.post(`${this.usuarioURL}/crear`, user);
  }

  generateToken(loginData: any) {
    return this.httpClient.post(`${this.tokenURL}`, loginData);
  }

  public getCurrentUser(){
    return this.httpClient.get(`${this.tokenObtenerUserURL}`);
  }

  iniciarSesion(token: any) {
    localStorage.setItem("token", token);
  }

  sesionIniciada() {
    let tokenStr = localStorage.getItem("token");
    if (tokenStr == undefined || tokenStr == "" || tokenStr == null) {
      return false;
    } else {
      return true;
    }
  }

  getToken() {
    return localStorage.getItem("token");
  }

  setUser(user: any) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  getUser() {
    let userStr = localStorage.getItem("user");
    if (userStr != null) {
      return JSON.parse(userStr);
    } else {
      this.deslogear();
      return null;
    }
  }

  deslogear() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return true;
  }


  /*
  // método para mostrar vendedores registrados
  obtenerVendedoresRegistrados():Observable<Vendedor[]> {
    return this.httpClient.get<Vendedor[]>(`${this.baseURLVendedor}`);
  }

  // método para mostrar ventas registradas
  obtenerVentasRegistradas():Observable<Venta[]> {
    return this.httpClient.get<Venta[]>(`${this.baseURLFactura}`);
  }

  // este método nos sirve para registrar un vendedor en la base de datos
  registrarVendedor(vendedor: Vendedor) : Observable<Object> {
    return this.httpClient.post(`${this.baseURLVendedor}`, vendedor);
  }

  // este método nos sirve para registrar un producto en la base de datos
  registrarProducto(producto: Producto) : Observable<Object> {
    return this.httpClient.post(`${this.baseURLProducto}`, producto);
  }

  // este método nos sirve para registrar un producto en la base de datos
  registrarVenta(venta: Venta) : Observable<Object> {
    return this.httpClient.post(`${this.baseURLFactura}`, venta);
  } */


  // -------------------------------------------


}
