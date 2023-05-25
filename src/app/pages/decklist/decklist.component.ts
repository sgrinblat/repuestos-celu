import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ElementRef } from '@angular/core';

import Swal from 'sweetalert2';

import { ConexionService } from 'src/app/service/conexion.service';
import { Carta } from '../../carta';
import { Rareza } from 'src/app/rareza';
import { Expansion } from '../../expansion';
import { Tipo } from '../../tipo';
import { Decklist } from 'src/app/decklist';

@Component({
  selector: 'app-decklist',
  templateUrl: './decklist.component.html',
  styleUrls: ['./decklist.component.css']
})
export class DecklistComponent implements OnInit {

  searchText: string | null = null;
  selectedRareza: number | null = null;
  selectedExpansion: number | null = null;
  selectedTipo: number | null = null;
  filteredCartas: Carta[] = [];
  cartas!: Carta[];
  decklists!: Decklist[];

  expansiones: Observable<Expansion[]>;
  rarezas: Observable<Rareza[]>;
  tipos: Tipo[] = [];

  reino: Carta[];
  boveda: Carta[];
  sidedeck: Carta[];

  banderaLista = true;


  constructor(private conexion: ConexionService, private activatedRoute: ActivatedRoute, private route: Router) {
    this.reino = new Array<Carta>();
    this.boveda = new Array<Carta>();
    this.sidedeck = new Array<Carta>();
  }

  ngOnInit(): void {

    this.obtenerDecklists();
    this.obtenerCartas();
    this.expansiones = this.conexion.getTodasLasExpas();
    this.rarezas = this.conexion.getTodasLasRarezas();
    this.conexion.getTodasLosTipos().pipe(
      map(tipos => tipos.sort((a, b) => a.nombreTipo.localeCompare(b.nombreTipo)))
    ).subscribe(tipos => {
      this.tipos = tipos;
    });


  }

  onRarezaChange(selectedRareza: number) {
    this.selectedRareza = selectedRareza;
    console.log(this.selectedRareza);
    this.filterCartas();
  }

  onExpansionChange(selectedExpansion: number) {
    this.selectedExpansion = selectedExpansion;
    console.log(this.selectedExpansion);
    this.filterCartas();
  }

  onTipoChange(selectedTipo: number) {
    this.selectedTipo = selectedTipo;
    console.log(this.selectedTipo);
    this.filterCartas();
  }

  searchByText() {
    this.filteredCartas = this.cartas.filter(carta => {
      if(carta.nombreCarta.includes(this.searchText)) {
        return true;
      } else {
        return false;
      }
    });
  }

  filterCartas() {
    this.filteredCartas = this.cartas.filter(carta => {

      if(this.selectedExpansion !== null && this.selectedRareza !== null && this.selectedTipo !== null) {
        if(carta.rareza.idRareza == this.selectedRareza
          && carta.tipo.idTipo == this.selectedTipo
          && carta.expansion.idExpansion == this.selectedExpansion)
          {
            return true;
          } else {
            return false;
          }
      }

      if(this.selectedExpansion !== null && this.selectedRareza !== null) {
        if(carta.rareza.idRareza == this.selectedRareza
          && carta.expansion.idExpansion == this.selectedExpansion)
          {
            return true;
          } else {
            return false;
          }
      }

      if(this.selectedExpansion !== null && this.selectedTipo !== null) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.expansion.idExpansion == this.selectedExpansion)
          {
            return true;
          } else {
            return false;
          }
      }

      if(this.selectedRareza !== null && this.selectedTipo !== null) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.rareza.idRareza == this.selectedRareza)
          {
            return true;
          } else {
            return false;
          }
      }

      if(this.selectedRareza !== null) {
        if(carta.rareza.idRareza == this.selectedRareza)
          {
            return true;
          } else {
            return false;
          }
      }
      if(this.selectedExpansion !== null) {
        if(carta.expansion.idExpansion == this.selectedExpansion)
          {
            return true;
          } else {
            return false;
          }
      }
      if(this.selectedTipo !== null) {
        if(carta.tipo.idTipo == this.selectedTipo)
          {
            return true;
          } else {
            return false;
          }
      }

      return false;
    });
  }


  obtenerCartas() {
    this.conexion.getTodasLasCartasOrdenadas().subscribe((dato) => {
      this.cartas = dato;
    });
  }

  obtenerDecklists() {
    this.conexion.getTodasLasDecklists().subscribe((dato) => {
      this.decklists = dato;
    });
  }


  getCartasUnicas(lista: Carta[]): Carta[] {
    return lista.filter((carta, i, self) =>
      i === self.findIndex((c) => c.nombreCarta === carta.nombreCarta)
    );
  }

  getCantidad(carta: Carta, lista: Carta[]): number {
    return lista.filter((c) => c.nombreCarta === carta.nombreCarta).length;
  }


  agregarCarta(carta: Carta) {

    if(this.banderaLista) {
      if(carta.tipo.nombreTipo == "TESORO") {
        const cantidadPrincipal = this.getCantidad(carta, this.boveda);
        const cantidadSide = this.getCantidad(carta, this.sidedeck);
        if((cantidadPrincipal + cantidadSide) > 1) {
          Swal.fire({
            icon: 'error',
            title: 'No tan rápido, general',
            text: 'No puedes agregar a tu Bóveda más de 2 copias del mismo Tesoro!',
            background: '#2e3031',
            color: '#fff'
          })
          return;
        }
        this.boveda.push(carta);
        this.boveda.sort((a, b) => {
          if(a.nombreCarta < b.nombreCarta) { return -1; }
          if(a.nombreCarta > b.nombreCarta) { return 1; }
          return 0;
        });
      } else {
        const cantidadPrincipal = this.getCantidad(carta, this.reino);
        const cantidadSide = this.getCantidad(carta, this.sidedeck);
        if ((cantidadPrincipal + cantidadSide) > 3) {
          Swal.fire({
            icon: 'error',
            title: 'No tan rápido, general',
            text: 'No puedes agregar a tu Reino más de 4 copias de la misma carta!',
            background: '#2e3031',
            color: '#fff'
          })
          return;
        }

        this.reino.push(carta);
        this.reino.sort((a, b) => {
          if(a.nombreCarta < b.nombreCarta) { return -1; }
          if(a.nombreCarta > b.nombreCarta) { return 1; }
          return 0;
        });
      }
    } else {
      if (carta.tipo.nombreTipo == "TESORO") {
        const cantidadPrincipal = this.getCantidad(carta, this.boveda);
        const cantidadSide = this.getCantidad(carta, this.sidedeck);
        if((cantidadPrincipal + cantidadSide) > 1) {
          Swal.fire({
            icon: 'error',
            title: 'No tan rápido, general',
            text: 'No puedes agregar a tu Side Deck más de 2 copias del mismo Tesoro!',
            background: '#2e3031',
            color: '#fff'
          })
          return;
        }
      } else if (carta.tipo.nombreTipo != "TESORO") {
        const cantidadPrincipal = this.getCantidad(carta, this.reino);
        const cantidadSide = this.getCantidad(carta, this.sidedeck);
        if((cantidadPrincipal + cantidadSide) > 3) {
          Swal.fire({
            icon: 'error',
            title: 'No tan rápido, general',
            text: 'No puedes agregar a tu Reino más de 4 copias de la misma carta!',
            background: '#2e3031',
            color: '#fff'
          })
          return;
        }
      }

      this.sidedeck.push(carta);
      this.sidedeck.sort((a, b) => {
        if(a.nombreCarta < b.nombreCarta) { return -1; }
        if(a.nombreCarta > b.nombreCarta) { return 1; }
        return 0;
      });
    }

  }

  eliminarCarta(carta: Carta, lista: Carta[]) {
    //this.nuevaLista = this.nuevaLista.filter(item => item !== carta);
    const index = lista.findIndex(item => item === carta);
    if (index !== -1) {
      lista.splice(index, 1);
    }
  }

  getTotalCartas(lista: Carta[]) {
    return lista.length;
  }

  switchearEntreMainAndSidedeck() {
    this.banderaLista = !this.banderaLista;

    if(this.banderaLista) {
      Swal.fire({
        icon: 'info',
        title: 'Cambiando!',
        text: 'Ahora las cartas que clickes estarás agregandolas a tu mazo principal',
        background: '#2e3031',
        color: '#fff'
      })
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Cambiando!',
        text: 'Ahora las cartas que clickes estarás agregandolas a tu Side Deck',
        background: '#2e3031',
        color: '#fff'
      })
    }

  }


  guardarDecklist() {
        // if(this.getTotalCartas("TESORO") > 3) {
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'No tan rápido, general',
    //     text: 'El máximo de tu Bóveda es de 15 Tesoros!',
    //     background: '#2e3031',
    //     color: '#fff'
    //   })
    //   return;
    // } else if (this.getTotalCartas("NON_TESORO") > 5) {
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'No tan rápido, general',
    //     text: 'El máximo de tu Reino es de 60 cartas!',
    //     background: '#2e3031',
    //     color: '#fff'
    //   })
    // } else {

    // }
  }

  copyToClipboard() {
    let str = "Reino: (total: " + this.getTotalCartas(this.reino) + ")\n";
    this.getCartasUnicas(this.reino).forEach(carta => {
      str += carta.nombreCarta + " x" + this.getCantidad(carta, this.reino) + "\n";
    });
    // this.reino.forEach(carta => {
    //   str += carta.nombreCarta + " x" + this.getCantidad(carta, this.reino) + "\n";
    // });

    str += `\n Bóveda: (total: ${this.getTotalCartas(this.boveda)}) \n`
    this.getCartasUnicas(this.boveda).forEach(carta => {
      str += carta.nombreCarta + " x" + this.getCantidad(carta, this.boveda) + "\n";
    });

    str += `\n Side Deck: (total: ${this.getTotalCartas(this.sidedeck)}) \n`
    this.getCartasUnicas(this.sidedeck).forEach(carta => {
      str += carta.nombreCarta + " x" + this.getCantidad(carta, this.sidedeck) + "\n";
    });

    navigator.clipboard.writeText(str).then(function() {
      Swal.fire({
        icon: 'success',
        title: 'Copiado!',
        text: 'Ya tienes toda la lista copiada en tu portapapeles!',
        background: '#2e3031',
        color: '#fff'
      })
    }, function(err) {
      Swal.fire({
        icon: 'error',
        title: 'Esto es culpa del rey!',
        text: 'Algo salió mal, no se pudo copiar la lista',
        background: '#2e3031',
        color: '#fff'
      })
    });
}

  onImageLoad(event: Event) {
    const imageElement = event.target as HTMLImageElement;
    const elementRef = new ElementRef(imageElement);
    elementRef.nativeElement.classList.add('fade-in');
  }

}
