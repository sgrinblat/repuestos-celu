import { Component, ViewEncapsulation, ViewChild } from "@angular/core";
import { SwiperComponent } from "swiper/angular";

// import Swiper core and required modules
import SwiperCore, { Pagination, Navigation } from "swiper";
import Swal from "sweetalert2";

// install Swiper modules
SwiperCore.use([Pagination, Navigation]);

@Component({
  selector: 'app-tiendas',
  templateUrl: './tiendas.component.html',
  styleUrls: ['./tiendas.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TiendasComponent {

  constructor() { }

  mostrarRefugio () {
    Swal.fire({
      title: 'El Refugio Store',
      text: 'Av. Cabildo 2040 Local 88, CABA',
      imageUrl: '../../../assets/images/refudire.png',
      width: 700,
      imageWidth: 700,
      imageHeight: 400,
      imageAlt: 'Custom image',
      showCloseButton: true,
      showConfirmButton: false,
      color: "#fff",
      background: "#2e3031"
    })
  }

  mostrarZ () {
    Swal.fire({
      title: 'Magic Z',
      text: 'Yerbal 2250 Local 12, CABA',
      imageUrl: '../../../assets/images/zdire.png',
      width: 700,
      imageWidth: 700,
      imageHeight: 400,
      imageAlt: 'Custom image',
      showCloseButton: true,
      showConfirmButton: false,
      color: "#fff",
      background: "#2e3031"
    })
  }

  mostrarLair () {
    Swal.fire({
      title: 'Magic Lair',
      text: 'Av. Alberdi 1170, CABA',
      imageUrl: '../../../assets/images/lairdire.png',
      width: 700,
      imageWidth: 700,
      imageHeight: 400,
      imageAlt: 'Custom image',
      showCloseButton: true,
      showConfirmButton: false,
      color: "#fff",
      background: "#2e3031"
    })
  }


}
