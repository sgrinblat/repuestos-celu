import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CotizacionService } from './cotizacion.service';
import { Jugador } from '../../../jugador';
import { ConexionService } from '../../../service/conexion.service';

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
  peso: number;
  cantidad?: number;
  stock?: boolean;
}


@Component({
  selector: 'app-folleto',
  templateUrl: './folleto.component.html',
  styleUrls: ['./folleto.component.css'],
})

export class FolletoComponent implements OnInit {

  constructor(private router: Router, private httpClient: HttpClient, private cotizacionService: CotizacionService, private conexion: ConexionService) {

  }

  codigo = "";
  cotizaciones: CurrencyResponse;
  cotizacionCripto: CurrencyCripto;
  cotizacionMostrada: number = 0;
  pesoTotal: number = 0;
  totalUnidades: number;
  precioSinDescuento: number;
  precioTotal: number;
  textoDescuento: string;
  textoGanancia: string;
  jugadores: Jugador[];


  ngOnInit() {

    this.conexion.getJugadoresPorPuntos().subscribe((dato) => {
      this.jugadores = dato;
      this.cotizacionMostrada = this.jugadores[18].puntosApertura;
      console.log(this.jugadores[18])
    });

    this.codigo = prompt("Ingrese el código para ingresar a esta sección: ");

    if(this.codigo !== "77511") {
      this.router.navigate(["/"]);
    } else {

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

    }
  }

  productos: Producto[] = [
    {
      nombre: 'Mazo Dual - 2 jugadores',
      imagenUrl: 'https://i.postimg.cc/wMhwHR7k/frente-1.webp',
      precioDolar: 36,
      peso: 0.400,
      stock: true
    },
    {
      nombre: 'Caja de boosters Pacto Secreto',
      imagenUrl: 'https://lairentcg.com.ar/assets/images/pacto/caja%20pacto%20de%20boosters.png',
      precioDolar: 17,
      peso: 0.140,
      stock: true
    },
    {
      nombre: 'Caja de boosters Trono Compartido',
      imagenUrl: 'https://lairentcg.com.ar/assets/images/trono/cajatrono.png',
      precioDolar: 17,
      peso: 0.140,
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
      peso: 0.200,
      stock: false
    },
    {
      nombre: 'Caja de boosters de Fundamentos',
      imagenUrl: 'https://lairentcg.com.ar/assets/images/caja%20booster%20fundamentos.webp',
      precioDolar: 15,
      peso: 0.130,
      stock: false
    }
  ];

  slotDeTorneo: Producto[] = [
    {
      nombre: 'Slot de Torneo tienda',
      imagenUrl: 'https://i.postimg.cc/vZmwVQLx/caja-2.png',
      precioDolar: (this.productos[1].precioDolar * 2) * 0.7,
      peso: 0.280,
      stock: true
    },
  ];


  calcularTotales(): void {
    // Cálculos que se almacenan en propiedades
    this.totalUnidades = this.calcularTotalUnidades();
    this.pesoTotal = this.calcularPesoTotal();

    this.precioSinDescuento = this.calcularPrecioSinDescuento();
    this.precioTotal = this.calcularPrecioTotal();
    this.textoDescuento = this.obtenerTextoDescuento();
    this.textoGanancia = this.obtenerTextoGanancia();
  }

  calcularTotalUnidades(): number {
    return this.productos.reduce((acc, producto) => acc + (producto.cantidad || 0), 0);
  }

  calcularPesoTotal() {
    return this.productos.reduce((acc, producto) => acc + (producto.cantidad || 0) * producto.peso, 0);
  }

  obtenerDescuentoPorCantidad(cantidad: number): number {
    if (cantidad < 3) {
      return 0; // 0% de descuento
    } else if (cantidad < 7) {
      return 0.30; // 30% de descuento
    } else if (cantidad < 11) {
      return 0.35; // 35% de descuento
    } else if (cantidad < 80) {
      return 0.40; // 40% de descuento
    } else {
      return 0.45; // 45% de descuento
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

  obtenerTextoGanancia(): string {
    const totalUnidades = this.calcularTotalUnidades();
    const precioSinDescuento = this.productos.reduce((acc, producto) => acc + (producto.cantidad || 0) * producto.precioDolar, 0);
    const descuento = this.obtenerDescuentoPorCantidad(totalUnidades);
    const precioConDescuento = precioSinDescuento * (1 - descuento);
    const gananciaVendedor = (precioSinDescuento - precioConDescuento);
    let gananciaPorcentaje = (gananciaVendedor / precioConDescuento) * 100;
    gananciaPorcentaje = Math.round(gananciaPorcentaje);
    return descuento > 0 ? `${gananciaPorcentaje}% de ganancia` : '';
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

