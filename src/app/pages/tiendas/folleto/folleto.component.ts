import { HttpClient } from '@angular/common/http';
import { Component, Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CotizacionService } from './cotizacion.service';

interface CurrencyInfo {
  value_avg: number;
  value_sell: number;
  value_buy: number;
}

interface CurrencyResponse {
  oficial: CurrencyInfo;
  blue: CurrencyInfo;
  oficial_euro: CurrencyInfo;
  blue_euro: CurrencyInfo;
  last_update: string;
}

interface Producto {
  nombre: string;
  imagenUrl: string;
  precioDolar: number;
  precioPesos?: number;
  cantidad?: number;
}


@Component({
  selector: 'app-folleto',
  templateUrl: './folleto.component.html',
  styleUrls: ['./folleto.component.css']
})

export class FolletoComponent implements OnInit {

  constructor(private router: Router, private httpClient: HttpClient, private cotizacionService: CotizacionService) {

  }

  codigo = "";
  cotizaciones: CurrencyResponse;


  ngOnInit() {

    this.codigo = prompt("Ingrese el código para ingresar a esta sección: ");

    if(this.codigo !== "77511") {
      this.router.navigate(["/"]);
    } else {
      this.cotizacionService.getCotizaciones().subscribe(data => {
        this.cotizaciones = data;
      });
    }

  }

  productos: Producto[] = [
    {
      nombre: 'Relatos de Aixa',
      imagenUrl: 'https://lairentcg.com.ar/assets/images/frente%20mazo%20aixa.png',
      precioDolar: 20
    },
    {
      nombre: 'Caja de boosters de Fundamentos',
      imagenUrl: 'https://lairentcg.com.ar/assets/images/caja%20booster%20fundamentos.png',
      precioDolar: 12
    },
    {
      nombre: 'Caja de boosters Pacto Secreto',
      imagenUrl: 'https://lairentcg.com.ar/assets/images/pacto/caja%20pacto%20de%20boosters.png',
      precioDolar: 15
    }
  ];

  calcularTotalUnidades(): number {
    return this.productos.reduce((acc, producto) => acc + (producto.cantidad || 0), 0);
  }

  obtenerDescuentoPorCantidad(cantidad: number): number {
    if (cantidad < 10) {
      return 0; // 0% de descuento
    } else if (cantidad > 9 && cantidad < 20) {
      return 0.40; // 40% de descuento
    } else if (cantidad > 19 && cantidad < 80) {
      return 0.45; // 45% de descuento
    } else {
      return 0.50; // 50% de descuento
    }
  }

  calcularPrecioSinDescuento(): number {
    return this.productos.reduce((acc, producto) => acc + (producto.cantidad || 0) * producto.precioDolar, 0);
  }

  calcularPrecioTotal(): number {
    const totalUnidades = this.calcularTotalUnidades();
    const precioSinDescuento = this.productos.reduce((acc, producto) => acc + (producto.cantidad || 0) * producto.precioDolar, 0);

    const descuento = this.obtenerDescuentoPorCantidad(totalUnidades);
    const precioConDescuento = precioSinDescuento * (1 - descuento);

    return precioConDescuento;
  }

  obtenerTextoDescuento(): string {
    const totalUnidades = this.calcularTotalUnidades();
    const descuento = this.obtenerDescuentoPorCantidad(totalUnidades);
    return descuento > 0 ? `${descuento * 100}% de descuento` : '';
  }


}

