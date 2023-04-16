import { Component, ViewEncapsulation, ViewChild } from "@angular/core";
import { SwiperComponent } from "swiper/angular";

// import Swiper core and required modules
import SwiperCore, { EffectCards } from "swiper";

// install Swiper modules
SwiperCore.use([EffectCards]);

@Component({
  selector: 'app-carrusel-cartas',
  templateUrl: './carrusel-cartas.component.html',
  styleUrls: ['./carrusel-cartas.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CarruselCartasComponent {

  constructor() { }

}
