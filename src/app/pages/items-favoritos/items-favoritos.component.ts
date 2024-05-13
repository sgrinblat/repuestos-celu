import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/models/producto.model';
import { ConexionService } from 'src/app/service/conexion.service';

@Component({
  selector: 'app-items-favoritos',
  templateUrl: './items-favoritos.component.html',
  styleUrls: ['./items-favoritos.component.css']
})
export class ItemsFavoritosComponent implements OnInit {
  productos: Producto[] = []; // Lista de productos

  constructor(private conexionService: ConexionService) { }

  ngOnInit() {
    this.fetchFavoriteProducts();
  }

  fetchFavoriteProducts() {
    this.conexionService.getFavoriteList().subscribe({
      next: (productos) => {
        this.productos = productos;
      },
      error: (error) => {
        console.error('Error fetching favorite products:', error);
      }
    });
  }
}
