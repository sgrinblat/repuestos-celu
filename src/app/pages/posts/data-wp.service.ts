import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { Observable, Subject } from 'rxjs';
//import { PostI } from './post.interface';

@Injectable({
  providedIn: 'root'
})
export class DataWpService {

  urlApi = "http://localhost/wordpress/wp-json/wp/v2/posts?_embed";
  urlLore = "http://localhost/wordpress/wp-json/wp/v2/posts?categories=3";
  urlNoticias = "http://localhost/wordpress/wp-json/wp/v2/posts?categories=2";

  constructor(private httpClient: HttpClient) { }


  getEntradas():Observable<any[]> {
    return this.httpClient.get<any[]>(this.urlApi, {
      params: {
        per_page: '9'
      }
    });
  }

  getEntradasLore():Observable<any[]> {
    return this.httpClient.get<any[]>(this.urlLore, {
    });
  }

  getEntradasNoticias():Observable<any[]> {
    return this.httpClient.get<any[]>(this.urlNoticias, {
    });
  }

  getUltimasNoticias():Observable<any[]> {
    return this.httpClient.get<any[]>(this.urlNoticias, {
      params: {
        per_page: '3'
      }
    });
  }

  getEntradaPorId(id: number):Observable<any> {
    return this.httpClient.get<any>(`${this.urlApi}/${id}`);
  }

}
