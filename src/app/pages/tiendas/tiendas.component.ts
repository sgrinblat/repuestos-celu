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

  // tiendas!: Tienda[];
  // tiendasPorPais!: Tienda[];
  // tiendasSeleccionadas!: Tienda[];

  tiendasSeleccionadas: Tienda[]; // Asumiendo que Tienda es el tipo de tus objetos de tienda
  tiendasPorPaisSeleccionado: Tienda[] = [];
  tiendasPorPais: {[pais: string]: Tienda[]} = {}; // Para guardar las tiendas por país
  provinciasSeleccionadas: {[provincia: string]: boolean} = {};

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private conexion: ConexionService) { }

  ngOnInit() {
    this.obtenerTiendas();

    if(isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }

  obtenerTiendas() {
    this.conexion.getTodasLasTiendas().subscribe((datos: Tienda[]) => {
      // Llenar `tiendasPorPais` con las tiendas
      datos.forEach((tienda) => {
        if (!this.tiendasPorPais[tienda.paisTienda]) {
          this.tiendasPorPais[tienda.paisTienda] = [];
        }
        this.tiendasPorPais[tienda.paisTienda].push(tienda);
      });
    });
  }

  mostrarTiendasPorPais(pais: string) {
    // Hacer una copia profunda para trabajar con los datos sin modificar el original
    this.tiendasPorPaisSeleccionado = [...this.tiendasPorPais[pais]];
    this.tiendasSeleccionadas = [...this.tiendasPorPaisSeleccionado];
    this.actualizarProvinciasSeleccionadas();
  }

  // Asegúrate de usar `tiendasPorPaisSeleccionado` como referencia para filtrar
  filtrarTiendasPorProvincia() {
    // Verificar si al menos una provincia está seleccionada
    const algunaProvinciaSeleccionada = Object.values(this.provinciasSeleccionadas).some(seleccionada => seleccionada);

    if (algunaProvinciaSeleccionada) {
      // Si alguna provincia está seleccionada, filtrar normalmente
      this.tiendasSeleccionadas = this.tiendasPorPaisSeleccionado.filter(tienda =>
        this.provinciasSeleccionadas[tienda.provinciaTienda]
      );
    } else {
      // Si ninguna provincia está seleccionada, mostrar todas las tiendas
      this.tiendasSeleccionadas = [...this.tiendasPorPaisSeleccionado];
    }
  }


  actualizarProvinciasSeleccionadas() {
    // Inicializa las provincias seleccionadas basado en `tiendasPorPaisSeleccionado`
    this.provinciasSeleccionadas = {};
    this.tiendasPorPaisSeleccionado.forEach(tienda => {
      this.provinciasSeleccionadas[tienda.provinciaTienda] = true;
    });
    // No es necesario llamar a `filtrarTiendasPorProvincia` aquí si quieres que inicialmente se muestren todas las tiendas
  }

  onProvinciaCheckboxChange(provincia: string, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const isChecked = inputElement.checked;
    this.provinciasSeleccionadas[provincia] = isChecked;
    this.filtrarTiendasPorProvincia();
  }

  getProvincias(): string[] {
    // Usa `tiendasPorPaisSeleccionado` para obtener la lista de provincias
    const provincias = this.tiendasPorPaisSeleccionado.map(tienda => tienda.provinciaTienda);
    return [...new Set(provincias)].sort(); // Elimina duplicados
  }

  // getProvincias(): string[] {
  //   const provincias = this.tiendasSeleccionadas.map(tienda => tienda.provinciaTienda);
  //   return [...new Set(provincias)].sort(); // Agregamos .sort() para ordenar alfabéticamente
  // }


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
      confirmButtonColor: '#d3a613',
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
