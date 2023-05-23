import { Component, ViewEncapsulation, ViewChild, Inject, OnInit, PLATFORM_ID } from "@angular/core";
import { SwiperComponent } from "swiper/angular";
import { isPlatformBrowser } from '@angular/common';
import { ElementRef } from '@angular/core';

// import Swiper core and required modules
import SwiperCore, { Pagination, Navigation } from "swiper";
import Swal from "sweetalert2";
import { ConexionService } from "src/app/service/conexion.service";
import { Tienda } from "src/app/tienda";

// install Swiper modules
SwiperCore.use([Pagination, Navigation]);

@Component({
  selector: 'app-tiendas',
  templateUrl: './tiendas.component.html',
  styleUrls: ['./tiendas.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TiendasComponent {

  tiendas!: Tienda[];

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private conexion: ConexionService) { }

  ngOnInit() {
    this.obtenerTiendas();

    if(isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }

  obtenerTiendas() {
    this.conexion.getTodasLasTiendas().subscribe((dato) => {
      this.tiendas = dato;
    });

  }

  mostrarDatosTienda(tienda: Tienda) {
    Swal.fire({
      title: tienda.nombreTienda,
      text: tienda.direccionTienda,
      imageUrl: tienda.mapaTienda,
      width: 700,
      imageWidth: 700,
      imageHeight: 400,
      imageAlt: 'Custom image',
      showCloseButton: true,
      confirmButtonColor: '#fec713',
      confirmButtonText: 'Visitar web!',
      color: "#fff",
      background: "#2e3031"
    }).then((result) => {
      if (result.isConfirmed) {
        location.assign(tienda.urlTienda);
      }
    })
  }

  onImageLoad(event: Event) {
    const imageElement = event.target as HTMLImageElement;
    const elementRef = new ElementRef(imageElement);
    elementRef.nativeElement.classList.add('fade-in');
  }


}
