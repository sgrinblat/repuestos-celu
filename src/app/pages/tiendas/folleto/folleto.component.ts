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

interface CurrencyCripto {
  ask: number;
  totalAsk: number;
  bid: number;
  totalBid: number;
  time: number;
}

interface Producto {
  nombre: string;
  imagenUrl: string;
  precioDolar: number;
  precioPesos?: number;
  cantidad?: number;
  stock?: boolean;
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
  cotizacionCripto: CurrencyCripto;
  cotizacionMostrada: number = 0;


  ngOnInit() {

    // this.cotizacionService.getCotizaciones().subscribe(data => {
    //   this.cotizaciones = data;

    //   this.cotizacionService.getCotizacionesCripto().subscribe(data => {
    //     this.cotizacionCripto = data;
    //     this.cotizacionCripto.totalAsk += 20;

    //     if(this.cotizacionCripto.totalAsk < 1000 && this.cotizaciones.blue.value_sell < 1000) {
    //       this.cotizacionMostrada = 1000;
    //     } else if(this.cotizacionCripto.totalAsk > this.cotizaciones.blue.value_sell) {
    //       this.cotizacionMostrada = this.cotizacionCripto.totalAsk;
    //       this.cotizacionMostrada += 10;
    //     } else {
    //       this.cotizacionMostrada = this.cotizaciones.blue.value_sell;
    //       this.cotizacionMostrada += 10;
    //     }
    //   });
    // });

    this.codigo = prompt("Ingrese el código para ingresar a esta sección: ");

    if(this.codigo !== "77511") {
      this.router.navigate(["/"]);
    } else {
      this.cotizacionService.getCotizaciones().subscribe(data => {
        this.cotizaciones = data;

        this.cotizacionService.getCotizacionesCripto().subscribe(data => {
          this.cotizacionCripto = data;
          this.cotizacionCripto.totalAsk += 20;

          if(this.cotizacionCripto.totalAsk < 1000 && this.cotizaciones.blue.value_sell < 1000) {
            this.cotizacionMostrada = 1000;
          } else if(this.cotizacionCripto.totalAsk > this.cotizaciones.blue.value_sell) {
            this.cotizacionMostrada = this.cotizacionCripto.totalAsk;
            this.cotizacionMostrada += 10;
          } else {
            this.cotizacionMostrada = this.cotizaciones.blue.value_sell;
            this.cotizacionMostrada += 10;
          }
        });
      });
    }

  }

  productos: Producto[] = [
    {
      nombre: 'Mazo Dual - 2 jugadores',
      imagenUrl: 'https://i.postimg.cc/wMhwHR7k/frente-1.webp',
      precioDolar: 40,
      stock: true
    },
    {
      nombre: 'Caja de boosters Pacto Secreto',
      imagenUrl: 'https://lairentcg.com.ar/assets/images/pacto/caja%20pacto%20de%20boosters.png',
      precioDolar: 21,
      stock: true
    },
    // {
    //   nombre: 'Slot de Torneo tienda (2 cajas de boosters + cartas promos)',
    //   imagenUrl: 'https://lairentcg.com.ar/assets/images/pacto/caja%202.png',
    //   precioDolar: 42,
    //   stock: true
    // },
    {
      nombre: 'Relatos de Aixa',
      imagenUrl: 'https://lairentcg.com.ar/assets/images/frente%20mazo%20aixa.webp',
      precioDolar: 24,
      stock: false
    },
    {
      nombre: 'Caja de boosters de Fundamentos',
      imagenUrl: 'https://lairentcg.com.ar/assets/images/caja%20booster%20fundamentos.webp',
      precioDolar: 15,
      stock: false
    }
  ];

  slotDeTorneo: Producto[] = [
    {
      nombre: 'Slot de Torneo tienda',
      imagenUrl: 'https://i.postimg.cc/vZmwVQLx/caja-2.png',
      precioDolar: (this.productos[1].precioDolar * 2) * 0.7,
      stock: true
    },
  ];

  calcularTotalUnidades(): number {
    return this.productos.reduce((acc, producto) => acc + (producto.cantidad || 0), 0);
  }

  obtenerDescuentoPorCantidad(cantidad: number): number {
    if (cantidad < 5) {
      return 0; // 0% de descuento
    } else if (cantidad < 10) {
      return 0.35; // 35% de descuento
    } else if (cantidad < 30) {
      return 0.40; // 40% de descuento
    } else if (cantidad < 80) {
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
    const descuentoPorcentaje = Math.round(descuento * 100);
    return descuento > 0 ? `${descuentoPorcentaje}% de descuento` : '';
  }






  calcularTotalUnidadesFolleto(): number {
    return this.slotDeTorneo.reduce((acc, producto) => acc + (producto.cantidad || 0), 0);
  }

  obtenerDescuentoPorCantidadFolleto(cantidad: number): number {
    if (cantidad < 10) {
      return 0; // 0% de descuento
    } else if (cantidad > 9 && cantidad < 20) {
      return 0.40; // 40% de descuento
    } else if (cantidad > 19 && cantidad < 50) {
      return 0.45; // 45% de descuento
    } else if (cantidad > 49 && cantidad < 100) {
      return 0.50; // 50% de descuento
    } else {
      return 0.55; // 55% de descuento
    }
  }

  calcularPrecioSinDescuentoFolleto(): number {
    return this.slotDeTorneo.reduce((acc, producto) => acc + (producto.cantidad || 0) * producto.precioDolar, 0);
  }

  calcularPrecioTotalFolleto(): number {
    const totalUnidades = this.calcularTotalUnidadesFolleto();
    const precioSinDescuento = this.slotDeTorneo.reduce((acc, producto) => acc + (producto.cantidad || 0) * producto.precioDolar, 0);

    const descuento = this.obtenerDescuentoPorCantidadFolleto(totalUnidades);
    const precioConDescuento = precioSinDescuento * (1 - descuento);

    return precioConDescuento;
  }

  obtenerTextoDescuentoFolleto(): string {
    const totalUnidades = this.calcularTotalUnidadesFolleto();
    const descuento = this.obtenerDescuentoPorCantidadFolleto(totalUnidades);
    const descuentoPorcentaje = Math.round(descuento * 100);
    return descuento > 0 ? `${descuentoPorcentaje}% de descuento` : '';
  }



}

