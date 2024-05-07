import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Producto } from 'src/app/models/producto.model';
import { ConexionService } from 'src/app/service/conexion.service';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-home-listing',
  templateUrl: './home-listing.component.html',
  styleUrls: ['./home-listing.component.css']
})
export class HomeListingComponent implements OnInit {
  productos2: any[] = [];
  searchTerm: string = '';
  banderaListado: boolean = true;
  banderaSabana: boolean = false;

  constructor(private productService: ProductService, private router: ActivatedRoute, private route: Router) {}

  ngOnInit() {
    this.productService.currentProducts.subscribe(products => {
      this.productos2 = products;
    });

    this.productService.currentSearchTerm.subscribe(term => {
      this.searchTerm = term;
    });
  }

  modoListado() {
    this.banderaListado = true;
    this.banderaSabana = false;
  }

  modoSabana() {
    this.banderaListado = false;
    this.banderaSabana = true;
  }

  verProducto(id: number) {
    this.route.navigate(['producto', id]);
  }

}
