import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConexionService } from 'src/app/service/conexion.service';

@Component({
  selector: 'app-producto-individual',
  templateUrl: './producto-individual.component.html',
  styleUrls: ['./producto-individual.component.css']
})
export class ProductoIndividualComponent implements OnInit {
  product: any;

  constructor(
    private conexionService: ConexionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = params['id']; // Asumiendo que la ruta es algo como '/products/:id'
      this.loadProductDetails(productId);
    });
  }

  loadProductDetails(productId: number) {
    this.conexionService.getProductById(productId).subscribe(data => {
      if (data.status) {
        this.product = data.product;
      } else {
        console.error('No se pudo cargar los detalles del producto');
      }
    });
  }

}
