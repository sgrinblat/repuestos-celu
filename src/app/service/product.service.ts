import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ProductService {
  private productSource = new BehaviorSubject<any[]>([]);
  private searchTermSource = new BehaviorSubject<string>('');

  currentProducts = this.productSource.asObservable();
  currentSearchTerm = this.searchTermSource.asObservable();

  constructor() { }

  changeProductData(products: any[]) {
    this.productSource.next(products);
  }

  changeSearchTerm(term: string) {
    this.searchTermSource.next(term);
  }
}
