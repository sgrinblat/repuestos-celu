import { Component, OnInit } from '@angular/core';
import { ConexionService } from 'src/app/service/conexion.service';

@Component({
  selector: 'app-misordenes',
  templateUrl: './misordenes.component.html',
  styleUrls: ['./misordenes.component.css']
})
export class MisordenesComponent implements OnInit {
  ordenes: any[] = [];

  constructor(private conexionService: ConexionService) { }

  ngOnInit() {
    this.conexionService.obtenerOrdenes().subscribe({
      next: (response) => {
        if (response.status) {
          this.ordenes = response.orders;
        }
      },
      error: (error) => {
        console.error('Error al obtener las órdenes:', error);
      }
    });
  }
}
