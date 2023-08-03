import { Component, ViewEncapsulation, ViewChild } from "@angular/core";
import { SwiperComponent } from "swiper/angular";

// import Swiper core and required modules
import SwiperCore, { EffectCards } from "swiper";
import { Carta } from "src/app/carta";
import { ConexionService } from "src/app/service/conexion.service";

// install Swiper modules
SwiperCore.use([EffectCards]);

@Component({
  selector: 'app-carrusel-cartas',
  templateUrl: './carrusel-cartas.component.html',
  styleUrls: ['./carrusel-cartas.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CarruselCartasComponent {
  cartas: Carta[];

  constructor(private conexion: ConexionService) { }

  ngOnInit() {
    this.conexion.getCartaByExpansion(2).subscribe((dato) => {
      this.cartas = dato;

      this.cartas.sort((a, b) => {
        if (a.nombreCarta < b.nombreCarta) {
          return -1;
        }
        if (a.nombreCarta > b.nombreCarta) {
          return 1;
        }
        return 0;
      });
    });
  }

}
