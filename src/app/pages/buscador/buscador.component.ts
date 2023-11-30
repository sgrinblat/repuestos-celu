import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { ConexionService } from 'src/app/service/conexion.service';
import { Carta } from '../../carta';
import { Rareza } from 'src/app/rareza';
import { Expansion } from '../../expansion';
import { Tipo } from '../../tipo';
import { Subtipo } from 'src/app/subtipo';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css']
})
export class BuscadorComponent implements OnInit {

  searchName: string | null = null;
  searchText: string | null = null;
  selectedRareza: number | null = null;
  selectedExpansion: number | null = null;
  selectedTipo: number | null = null;
  selectedSubTipo: number | null = null;
  selectedSubTipo2: number | null = null;
  selectedSubTipo3: number | null = null;
  selectedCoste: number | null = null;
  filteredCartas: Carta[] = [];
  cartas!: Carta[];
  expansiones: Observable<Expansion[]>;
  rarezas: Rareza[] = [];
  tipos: Tipo[] = [];
  subtipos: Subtipo[] = [];
  costes: number[] = [];
  cantidadDeCartasMostrandose: number;


  constructor(private conexion: ConexionService, private activatedRoute: ActivatedRoute, private route: Router, private renderer: Renderer2) { }

  // El evento se activa cuando el mouse está sobre la imagen.
  onMouseEnter(event: MouseEvent): void {
    let imagen = event.target as HTMLElement;

    // Definir la función de 'mousemove' para esta imagen en particular.
    this.renderer.listen(imagen, 'mousemove', (e: MouseEvent) => {
      // Calcular la posición del cursor con respecto al centro de la imagen
      let rect = imagen.getBoundingClientRect();
      let x = (e.clientX - rect.left - rect.width / 1.5) / rect.width * 0.4;
      let y = (e.clientY - rect.top - rect.height / 1.5) / rect.height * 0.4;

      // Actualizar la transformación de la imagen
      imagen.style.transform = `rotateX(${y * 80}deg) rotateY(${-x * 40}deg) scale(1.25)`; // Agregado scale(1.2)
    });
  }

  // El evento se activa cuando el mouse sale de la imagen.
  onMouseLeave(event: MouseEvent): void {
    let imagen = event.target as HTMLElement;

    // Reiniciar la transformación cuando el mouse sale de la imagen
    imagen.style.transform = 'rotateX(0) rotateY(0) scale(1)'; // Agregado scale(1)
  }


  ngOnInit(): void {
    this.obtenerCartas();
    this.expansiones = this.conexion.getTodasLasExpas();

    this.conexion.getTodasLasRarezas().pipe(
      map(rarezas => {
        const order = ['BRONCE', 'PLATA', 'ORO', 'DIAMANTE', "ESMERALDA"];
        return rarezas.sort((a, b) => order.indexOf(a.nombreRareza) - order.indexOf(b.nombreRareza));
      })
    ).subscribe(rarezas => {
      this.rarezas = rarezas;
    });

    this.conexion.getTodasLosTipos().pipe(
      map(tipos => tipos.sort((a, b) => a.nombreTipo.localeCompare(b.nombreTipo)))
    ).subscribe(tipos => {
      this.tipos = tipos;
    });

    this.conexion.getTodasLosSubTipos().pipe(
      map(subtipos => subtipos.sort((a, b) => a.nombreSubTipo.localeCompare(b.nombreSubTipo)))
    ).subscribe(subtipos => {
      this.subtipos = subtipos;
    });

  }

  searchByName() {
    this.filteredCartas = this.cartas.filter(carta =>
      carta.nombreCarta.includes(this.searchName)
    );

    this.cantidadDeCartasMostrandose = this.filteredCartas.length;
  }

  searchByText() {
    this.filteredCartas = this.cartas.filter(carta =>
      carta.textoCarta.toLowerCase().includes(this.searchText.toLowerCase())
    );

    this.cantidadDeCartasMostrandose = this.filteredCartas.length;
  }


  visualizarCarta(id: number) {
    this.route.navigate(['buscador/cartas', id]);
  }

  acortarTexto(texto: string, limite: number = 35): string {
    if (texto.length <= limite) {
      return texto;
    }
    return `${texto.substr(0, limite)}...`;
  }

  onRarezaChange(selectedRareza: number) {
    this.selectedRareza = selectedRareza;
    if(this.selectedRareza == 0) {
      this.selectedRareza = null;
    }
    this.filterCartas();
    this.cantidadDeCartasMostrandose = this.filteredCartas.length;
  }

  onExpansionChange(selectedExpansion: number) {
    this.selectedExpansion = selectedExpansion;
    if(this.selectedExpansion == 0) {
      this.selectedExpansion = null;
    }
    this.filterCartas();
    this.cantidadDeCartasMostrandose = this.filteredCartas.length;
  }

  onTipoChange(selectedTipo: number) {
    this.selectedTipo = selectedTipo;
    if(this.selectedTipo == 0) {
      this.selectedTipo = null;
    }
    this.filterCartas();
    this.cantidadDeCartasMostrandose = this.filteredCartas.length;
  }

  onSubTipoChange(selectedSubTipo: number) {
    this.selectedSubTipo = selectedSubTipo;
    if(this.selectedSubTipo == 0) {
      this.selectedSubTipo = null;
    }
    this.filterCartas();
    this.cantidadDeCartasMostrandose = this.filteredCartas.length;
  }
  onSubTipo2Change(selectedSubTipo2: number) {
    this.selectedSubTipo2 = selectedSubTipo2;
    if(this.selectedSubTipo2 == 0) {
      this.selectedSubTipo2 = null;
    }
    this.filterCartas();
    this.cantidadDeCartasMostrandose = this.filteredCartas.length;
  }
  onSubTipo3Change(selectedSubTipo3: number) {
    this.selectedSubTipo3 = selectedSubTipo3;
    if(this.selectedSubTipo3 == 0) {
      this.selectedSubTipo3 = null;
    }
    this.filterCartas();
    this.cantidadDeCartasMostrandose = this.filteredCartas.length;
  }

  onCosteChange(selectedCoste: number) {
    this.selectedCoste = selectedCoste;
    if(this.selectedCoste == 0) {
      this.selectedCoste = null;
    }
    this.filterCartas();
    this.cantidadDeCartasMostrandose = this.filteredCartas.length;
  }


  filterCartas() {
    this.filteredCartas = this.cartas.filter(carta => {
      // FILTRO DE 7
      if(this.selectedExpansion !== null && this.selectedRareza !== null && this.selectedTipo !== null && this.selectedCoste !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null) {
        if(carta.rareza.idRareza == this.selectedRareza
          && carta.tipo.idTipo == this.selectedTipo
          && carta.expansion.idExpansion == this.selectedExpansion
          && carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 6
      if(this.selectedExpansion !== null && this.selectedRareza !== null && this.selectedTipo !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null
        ) {
        if(carta.rareza.idRareza == this.selectedRareza
          && carta.tipo.idTipo == this.selectedTipo
          && carta.expansion.idExpansion == this.selectedExpansion
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 6
      if(this.selectedRareza !== null && this.selectedTipo !== null && this.selectedCoste !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null
        ) {
        if(carta.rareza.idRareza == this.selectedRareza
          && carta.tipo.idTipo == this.selectedTipo
          && carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 6
      if(this.selectedExpansion !== null && this.selectedTipo !== null && this.selectedCoste !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.expansion.idExpansion == this.selectedExpansion
          && carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 6
      if(this.selectedExpansion !== null && this.selectedRareza !== null && this.selectedCoste !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null
        ) {
        if(carta.rareza.idRareza == this.selectedRareza
          && carta.expansion.idExpansion == this.selectedExpansion
          && carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 6
      if(this.selectedExpansion !== null && this.selectedRareza !== null && this.selectedCoste !== null && this.selectedTipo !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null
        ) {
        if(carta.rareza.idRareza == this.selectedRareza
          && carta.tipo.idTipo == this.selectedTipo
          && carta.expansion.idExpansion == this.selectedExpansion
          && carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 6
      if(this.selectedExpansion !== null && this.selectedRareza !== null && this.selectedCoste !== null && this.selectedTipo !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo3 !== null
        ) {
        if(carta.rareza.idRareza == this.selectedRareza
          && carta.tipo.idTipo == this.selectedTipo
          && carta.expansion.idExpansion == this.selectedExpansion
          && carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 6
      if(this.selectedExpansion !== null && this.selectedRareza !== null && this.selectedCoste !== null && this.selectedTipo !== null
        && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null
        ) {
        if(carta.rareza.idRareza == this.selectedRareza
          && carta.tipo.idTipo == this.selectedTipo
          && carta.expansion.idExpansion == this.selectedExpansion
          && carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 5
      if(this.selectedExpansion !== null && this.selectedRareza !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null
        ) {
        if(carta.rareza.idRareza == this.selectedRareza
          && carta.expansion.idExpansion == this.selectedExpansion
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 5
      if(this.selectedExpansion !== null && this.selectedTipo !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.expansion.idExpansion == this.selectedExpansion
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 5
      if(this.selectedTipo !== null && this.selectedCoste !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 5
      if(this.selectedExpansion !== null && this.selectedCoste !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null
        ) {
        if(carta.expansion.idExpansion == this.selectedExpansion
          && carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 5
      if(this.selectedRareza !== null && this.selectedCoste !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null
        ) {
        if(carta.rareza.idRareza == this.selectedRareza
          && carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 5
      if(this.selectedRareza !== null && this.selectedTipo !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 5
      if(this.selectedRareza !== null && this.selectedTipo !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null && this.selectedCoste !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && carta.costeCarta == this.selectedCoste
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 5
      if(this.selectedRareza !== null && this.selectedTipo !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo3 !== null && this.selectedCoste !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          && carta.costeCarta == this.selectedCoste
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 5
      if(this.selectedRareza !== null && this.selectedTipo !== null
        && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null && this.selectedCoste !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          && carta.costeCarta == this.selectedCoste
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 5
      if(this.selectedRareza !== null && this.selectedTipo !== null
        && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null && this.selectedExpansion !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 5
      if(this.selectedRareza !== null && this.selectedTipo !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null && this.selectedExpansion !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 5
      if(this.selectedRareza !== null && this.selectedTipo !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo3 !== null && this.selectedExpansion !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 5
      if(this.selectedRareza !== null && this.selectedTipo !== null
        && this.selectedSubTipo !== null && this.selectedCoste !== null && this.selectedExpansion !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && carta.costeCarta == this.selectedCoste
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 5
      if(this.selectedRareza !== null && this.selectedTipo !== null
        && this.selectedSubTipo2 !== null && this.selectedCoste !== null && this.selectedExpansion !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && carta.costeCarta == this.selectedCoste
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 5
      if(this.selectedRareza !== null && this.selectedTipo !== null
        && this.selectedSubTipo3 !== null && this.selectedCoste !== null && this.selectedExpansion !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          && carta.costeCarta == this.selectedCoste
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 5
      if(this.selectedRareza !== null && this.selectedExpansion !== null
        && this.selectedSubTipo3 !== null && this.selectedCoste !== null && this.selectedSubTipo !== null
        ) {
        if((this.compararSubtipos(this.selectedSubTipo, carta))
          && carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          && carta.costeCarta == this.selectedCoste
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 5
      if(this.selectedRareza !== null && this.selectedExpansion !== null
        && this.selectedSubTipo2 !== null && this.selectedCoste !== null && this.selectedSubTipo !== null
        ) {
        if((this.compararSubtipos(this.selectedSubTipo, carta))
          && carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && carta.costeCarta == this.selectedCoste
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 5
      if(this.selectedRareza !== null && this.selectedExpansion !== null
        && this.selectedSubTipo3 !== null && this.selectedCoste !== null && this.selectedSubTipo2 !== null
        ) {
        if((this.compararSubtipos(this.selectedSubTipo2, carta))
          && carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          && carta.costeCarta == this.selectedCoste
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 5
      if(this.selectedExpansion !== null && this.selectedTipo !== null
        && this.selectedSubTipo3 !== null && this.selectedCoste !== null && this.selectedSubTipo !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          && carta.costeCarta == this.selectedCoste
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 5
      if(this.selectedExpansion !== null && this.selectedTipo !== null
        && this.selectedSubTipo2 !== null && this.selectedCoste !== null && this.selectedSubTipo !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && carta.costeCarta == this.selectedCoste
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 5
      if(this.selectedExpansion !== null && this.selectedTipo !== null
        && this.selectedSubTipo3 !== null && this.selectedCoste !== null && this.selectedSubTipo2 !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          && carta.costeCarta == this.selectedCoste
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }


      // FILTRO DE 4
      if(this.selectedRareza !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null
        ) {
        if(carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 4
      if(this.selectedTipo !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 4
      if(this.selectedExpansion !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null
        ) {
        if(carta.expansion.idExpansion == this.selectedExpansion
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 4
      if(this.selectedCoste !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null
        ) {
        if(carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 4
      if(this.selectedCoste !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null && this.selectedExpansion !== null
        ) {
        if(carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 4
      if(this.selectedCoste !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo3 !== null && this.selectedExpansion !== null
        ) {
        if(carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 4
      if(this.selectedCoste !== null
        && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null && this.selectedExpansion !== null
        ) {
        if(carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 4
      if(this.selectedCoste !== null
        && this.selectedSubTipo !== null && this.selectedRareza !== null && this.selectedExpansion !== null
        ) {
        if(carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && carta.rareza.idRareza == this.selectedRareza
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 4
      if(this.selectedCoste !== null
        && this.selectedSubTipo2 !== null && this.selectedRareza !== null && this.selectedExpansion !== null
        ) {
        if(carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && carta.rareza.idRareza == this.selectedRareza
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 4
      if(this.selectedCoste !== null
        && this.selectedSubTipo3 !== null && this.selectedRareza !== null && this.selectedExpansion !== null
        ) {
        if(carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          && carta.rareza.idRareza == this.selectedRareza
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 4
      if(this.selectedCoste !== null
        && this.selectedSubTipo !== null && this.selectedTipo !== null && this.selectedExpansion !== null
        ) {
        if(carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && carta.tipo.idTipo == this.selectedTipo
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 4
      if(this.selectedCoste !== null
        && this.selectedSubTipo2 !== null && this.selectedTipo !== null && this.selectedExpansion !== null
        ) {
        if(carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && carta.tipo.idTipo == this.selectedTipo
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 4
      if(this.selectedCoste !== null
        && this.selectedSubTipo3 !== null && this.selectedTipo !== null && this.selectedExpansion !== null
        ) {
        if(carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          && carta.tipo.idTipo == this.selectedTipo
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 4
      if(this.selectedCoste !== null
        && this.selectedRareza !== null && this.selectedTipo !== null && this.selectedExpansion !== null
        ) {
        if(carta.costeCarta == this.selectedCoste
          && carta.rareza.idRareza == this.selectedRareza
          && carta.tipo.idTipo == this.selectedTipo
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 4 AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
      if(this.selectedCoste !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo3 !== null && this.selectedRareza !== null
        ) {
        if(carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 4
      if(this.selectedCoste !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null && this.selectedRareza !== null
        ) {
        if(carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && carta.rareza.idRareza == this.selectedRareza
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 4
      if(this.selectedCoste !== null
        && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null && this.selectedRareza !== null
        ) {
        if(carta.costeCarta == this.selectedCoste
          && carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 4
      if(this.selectedTipo !== null
        && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null && this.selectedRareza !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 4
      if(this.selectedTipo !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo3 !== null && this.selectedRareza !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 4
      if(this.selectedTipo !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null && this.selectedRareza !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 4
      if(this.selectedTipo !== null
        && this.selectedSubTipo !== null && this.selectedCoste !== null && this.selectedRareza !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && carta.costeCarta
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 4
      if(this.selectedTipo !== null
        && this.selectedSubTipo2 !== null && this.selectedCoste !== null && this.selectedRareza !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && carta.costeCarta
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 4
      if(this.selectedTipo !== null
        && this.selectedSubTipo3 !== null && this.selectedCoste !== null && this.selectedRareza !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          && carta.costeCarta
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 4
      if(this.selectedTipo !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo3 !== null && this.selectedExpansion !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.expansion.idExpansion == this.selectedExpansion
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 4
      if(this.selectedTipo !== null
        && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null && this.selectedExpansion !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.expansion.idExpansion == this.selectedExpansion
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 4
      if(this.selectedTipo !== null
        && this.selectedSubTipo2 !== null && this.selectedSubTipo2 !== null && this.selectedExpansion !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.expansion.idExpansion == this.selectedExpansion
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 4
      if(this.selectedRareza !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo3 !== null && this.selectedExpansion !== null
        ) {
        if(carta.rareza.idRareza == this.selectedRareza
          && carta.expansion.idExpansion == this.selectedExpansion
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 4
      if(this.selectedRareza !== null
        && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null && this.selectedExpansion !== null
        ) {
        if(carta.rareza.idRareza == this.selectedRareza
          && carta.expansion.idExpansion == this.selectedExpansion
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 4
      if(this.selectedRareza !== null
        && this.selectedSubTipo2 !== null && this.selectedSubTipo2 !== null && this.selectedExpansion !== null
        ) {
        if(carta.rareza.idRareza == this.selectedRareza
          && carta.expansion.idExpansion == this.selectedExpansion
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 4
      if(this.selectedCoste !== null
        && this.selectedSubTipo2 !== null && this.selectedSubTipo2 !== null && this.selectedTipo !== null
        ) {
        if(carta.costeCarta == this.selectedCoste
          && carta.tipo.idTipo == this.selectedTipo
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 4
      if(this.selectedCoste !== null
        && this.selectedSubTipo2 !== null && this.selectedSubTipo2 !== null && this.selectedTipo !== null
        ) {
        if(carta.costeCarta == this.selectedCoste
          && carta.tipo.idTipo == this.selectedTipo
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 4
      if(this.selectedCoste !== null
        && this.selectedSubTipo2 !== null && this.selectedSubTipo2 !== null && this.selectedTipo !== null
        ) {
        if(carta.costeCarta == this.selectedCoste
          && carta.tipo.idTipo == this.selectedTipo
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }


      // FILTRO DE 4
      if(this.selectedExpansion !== null
        && this.selectedSubTipo !== null && this.selectedTipo !== null && this.selectedRareza !== null
        ) {
        if(carta.rareza.idRareza == this.selectedRareza
          && carta.tipo.idTipo == this.selectedTipo
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 4
      if(this.selectedExpansion !== null
        && this.selectedSubTipo2 !== null && this.selectedTipo !== null && this.selectedRareza !== null
        ) {
        if(carta.rareza.idRareza == this.selectedRareza
          && carta.tipo.idTipo == this.selectedTipo
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 4
      if(this.selectedExpansion !== null
        && this.selectedSubTipo3 !== null && this.selectedTipo !== null && this.selectedRareza !== null
        ) {
        if(carta.rareza.idRareza == this.selectedRareza
          && carta.tipo.idTipo == this.selectedTipo
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }






      // FILTROS DE A 3
      if(this.selectedRareza !== null && this.selectedTipo !== null && this.selectedExpansion !== null) {
        if(carta.rareza.idRareza == this.selectedRareza
          && carta.tipo.idTipo == this.selectedTipo
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }
      if(this.selectedRareza !== null && this.selectedTipo !== null && this.selectedCoste !== null) {
        if(carta.rareza.idRareza == this.selectedRareza
          && carta.tipo.idTipo == this.selectedTipo
          && carta.costeCarta == this.selectedCoste
          )
          {
            return true;
          } else {
            return false;
          }
      }
      if(this.selectedCoste !== null && this.selectedExpansion !== null && this.selectedRareza !== null) {
        if(carta.rareza.idRareza == this.selectedRareza
          && carta.expansion.idExpansion == this.selectedExpansion
          && carta.costeCarta == this.selectedCoste
          )
          {
            return true;
          } else {
            return false;
          }
      }
      //



      // FILTROS DE A 3
      if(this.selectedRareza !== null && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null) {
        if(carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      if(this.selectedRareza !== null && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null) {
        if(carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      if(this.selectedRareza !== null && this.selectedSubTipo3 !== null && this.selectedSubTipo !== null) {
        if(carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      //

      // FILTROS DE A 3
      if(this.selectedExpansion !== null && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null) {
        if(carta.expansion.idExpansion == this.selectedExpansion
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      if(this.selectedExpansion !== null && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null) {
        if(carta.expansion.idExpansion == this.selectedExpansion
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      if(this.selectedExpansion !== null && this.selectedSubTipo3 !== null && this.selectedSubTipo !== null) {
        if(carta.expansion.idExpansion == this.selectedExpansion
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      //

      // FILTROS DE A 3
      if(this.selectedTipo !== null && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null) {
        if(carta.tipo.idTipo == this.selectedTipo
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      if(this.selectedTipo !== null && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null) {
        if(carta.tipo.idTipo == this.selectedTipo
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      if(this.selectedTipo !== null && this.selectedSubTipo3 !== null && this.selectedSubTipo !== null) {
        if(carta.tipo.idTipo == this.selectedTipo
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      //

      // FILTROS DE A 3
      if(this.selectedCoste !== null && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null) {
        if(carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      if(this.selectedCoste !== null && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null) {
        if(carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      if(this.selectedCoste !== null && this.selectedSubTipo3 !== null && this.selectedSubTipo !== null) {
        if(carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      //

      // FILTRO DE 3
      if(this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null && this.selectedSubTipo !== null) {
        if((this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }


      // FILTRO DE 3
      if(this.selectedExpansion !== null && this.selectedTipo !== null && this.selectedCoste !== null) {
        if(carta.costeCarta == this.selectedCoste
          && carta.expansion.idExpansion == this.selectedExpansion
          && carta.tipo.idTipo == this.selectedTipo
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 3
      if(this.selectedExpansion !== null && this.selectedTipo !== null && this.selectedSubTipo !== null) {
        if((this.compararSubtipos(this.selectedSubTipo, carta))
          && carta.expansion.idExpansion == this.selectedExpansion
          && carta.tipo.idTipo == this.selectedTipo
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 3
      if(this.selectedExpansion !== null && this.selectedTipo !== null && this.selectedSubTipo2 !== null) {
        if((this.compararSubtipos(this.selectedSubTipo2, carta))
          && carta.expansion.idExpansion == this.selectedExpansion
          && carta.tipo.idTipo == this.selectedTipo
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 3
      if(this.selectedExpansion !== null && this.selectedTipo !== null && this.selectedSubTipo3 !== null) {
        if((this.compararSubtipos(this.selectedSubTipo3, carta))
          && carta.expansion.idExpansion == this.selectedExpansion
          && carta.tipo.idTipo == this.selectedTipo
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 3
      if(this.selectedExpansion !== null && this.selectedRareza !== null && this.selectedSubTipo !== null) {
        if((this.compararSubtipos(this.selectedSubTipo, carta))
          && carta.expansion.idExpansion == this.selectedExpansion
          && carta.rareza.idRareza == this.selectedRareza
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 3
      if(this.selectedExpansion !== null && this.selectedRareza !== null && this.selectedSubTipo2 !== null) {
        if((this.compararSubtipos(this.selectedSubTipo2, carta))
          && carta.expansion.idExpansion == this.selectedExpansion
          && carta.rareza.idRareza == this.selectedRareza
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 3
      if(this.selectedExpansion !== null && this.selectedRareza !== null && this.selectedSubTipo3 !== null) {
        if((this.compararSubtipos(this.selectedSubTipo3, carta))
          && carta.expansion.idExpansion == this.selectedExpansion
          && carta.rareza.idRareza == this.selectedRareza
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 3
      if(this.selectedExpansion !== null && this.selectedCoste !== null && this.selectedSubTipo !== null) {
        if((this.compararSubtipos(this.selectedSubTipo, carta))
          && carta.expansion.idExpansion == this.selectedExpansion
          && carta.costeCarta == this.selectedCoste
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 3
      if(this.selectedExpansion !== null && this.selectedCoste !== null && this.selectedSubTipo2 !== null) {
        if((this.compararSubtipos(this.selectedSubTipo2, carta))
          && carta.expansion.idExpansion == this.selectedExpansion
          && carta.costeCarta == this.selectedCoste
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 3
      if(this.selectedExpansion !== null && this.selectedCoste !== null && this.selectedSubTipo3 !== null) {
        if((this.compararSubtipos(this.selectedSubTipo3, carta))
          && carta.expansion.idExpansion == this.selectedExpansion
          && carta.costeCarta == this.selectedCoste
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 3
      if(this.selectedRareza !== null && this.selectedCoste !== null && this.selectedSubTipo !== null) {
        if((this.compararSubtipos(this.selectedSubTipo, carta))
          && carta.rareza.idRareza == this.selectedRareza
          && carta.costeCarta == this.selectedCoste
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 3
      if(this.selectedRareza !== null && this.selectedCoste !== null && this.selectedSubTipo2 !== null) {
        if((this.compararSubtipos(this.selectedSubTipo2, carta))
          && carta.rareza.idRareza == this.selectedRareza
          && carta.costeCarta == this.selectedCoste
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 3
      if(this.selectedRareza !== null && this.selectedCoste !== null && this.selectedSubTipo3 !== null) {
        if((this.compararSubtipos(this.selectedSubTipo3, carta))
          && carta.rareza.idRareza == this.selectedRareza
          && carta.costeCarta == this.selectedCoste
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 3
      if(this.selectedTipo !== null && this.selectedCoste !== null && this.selectedSubTipo !== null) {
        if((this.compararSubtipos(this.selectedSubTipo, carta))
          && carta.tipo.idTipo == this.selectedTipo
          && carta.costeCarta == this.selectedCoste
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 3
      if(this.selectedTipo !== null && this.selectedCoste !== null && this.selectedSubTipo2 !== null) {
        if((this.compararSubtipos(this.selectedSubTipo2, carta))
          && carta.tipo.idTipo == this.selectedTipo
          && carta.costeCarta == this.selectedCoste
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 3
      if(this.selectedTipo !== null && this.selectedCoste !== null && this.selectedSubTipo3 !== null) {
        if((this.compararSubtipos(this.selectedSubTipo3, carta))
          && carta.tipo.idTipo == this.selectedTipo
          && carta.costeCarta == this.selectedCoste
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 3
      if(this.selectedTipo !== null && this.selectedRareza !== null && this.selectedSubTipo !== null) {
        if((this.compararSubtipos(this.selectedSubTipo, carta))
          && carta.tipo.idTipo == this.selectedTipo
          && carta.rareza.idRareza == this.selectedRareza
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 3
      if(this.selectedTipo !== null && this.selectedRareza !== null && this.selectedSubTipo2 !== null) {
        if((this.compararSubtipos(this.selectedSubTipo2, carta))
          && carta.tipo.idTipo == this.selectedTipo
          && carta.rareza.idRareza == this.selectedRareza
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 3
      if(this.selectedTipo !== null && this.selectedRareza !== null && this.selectedSubTipo3 !== null) {
        if((this.compararSubtipos(this.selectedSubTipo3, carta))
          && carta.tipo.idTipo == this.selectedTipo
          && carta.rareza.idRareza == this.selectedRareza
          )
          {
            return true;
          } else {
            return false;
          }
      }


      // FILTROS DE A 2
      if(this.selectedTipo !== null && this.selectedRareza !== null) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.rareza.idRareza == this.selectedRareza
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTROS DE A 2
      if(this.selectedTipo !== null && this.selectedExpansion !== null) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTROS DE A 2
      if(this.selectedTipo !== null && this.selectedCoste !== null) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.costeCarta == this.selectedCoste
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTROS DE A 2
      if(this.selectedRareza !== null && this.selectedCoste !== null) {
        if(carta.rareza.idRareza == this.selectedRareza
          && carta.costeCarta == this.selectedCoste
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTROS DE A 2
      if(this.selectedExpansion !== null && this.selectedCoste !== null) {
        if(carta.expansion.idExpansion == this.selectedExpansion
          && carta.costeCarta == this.selectedCoste
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTROS DE A 2
      if(this.selectedRareza !== null && this.selectedExpansion !== null) {
        if(carta.rareza.idRareza == this.selectedRareza
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTROS DE A 2
      if(this.selectedTipo !== null && this.selectedSubTipo !== null) {
        if(carta.tipo.idTipo == this.selectedTipo
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      if(this.selectedTipo !== null && this.selectedSubTipo2 !== null) {
        if(carta.tipo.idTipo == this.selectedTipo
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      if(this.selectedTipo !== null && this.selectedSubTipo3 !== null) {
        if(carta.tipo.idTipo == this.selectedTipo
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTROS DE A 2
      if(this.selectedRareza !== null && this.selectedSubTipo !== null) {
        if(carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      if(this.selectedRareza !== null && this.selectedSubTipo2 !== null) {
        if(carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      if(this.selectedRareza !== null && this.selectedSubTipo3 !== null) {
        if(carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      //

      // FILTROS DE A 2
      if(this.selectedExpansion !== null && this.selectedSubTipo !== null) {
        if(carta.expansion.idExpansion == this.selectedExpansion
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      if(this.selectedExpansion !== null && this.selectedSubTipo2 !== null) {
        if(carta.expansion.idExpansion == this.selectedExpansion
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      if(this.selectedExpansion !== null && this.selectedSubTipo3 !== null) {
        if(carta.expansion.idExpansion == this.selectedExpansion
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      //

      // FILTROS DE A 2
      if(this.selectedCoste !== null && this.selectedSubTipo !== null) {
        if(carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      if(this.selectedCoste !== null && this.selectedSubTipo2 !== null) {
        if(carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      if(this.selectedCoste !== null && this.selectedSubTipo3 !== null) {
        if(carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTROS DE A 2
      if(this.selectedSubTipo !== null && this.selectedSubTipo2 !== null) {
        if((this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      if(this.selectedSubTipo !== null && this.selectedSubTipo3 !== null) {
        if((this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      if(this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null) {
        if((this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      //

      // FILTROS DE 1
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

      if(this.selectedCoste !== null) {
        if(carta.costeCarta == this.selectedCoste)
          {
            return true;
          } else {
            return false;
          }
      }

      if(this.selectedSubTipo !== null) {
        return this.compararSubtipos(this.selectedSubTipo, carta);
      }
      if(this.selectedSubTipo2 !== null) {
        return this.compararSubtipos(this.selectedSubTipo2, carta);
      }
      if(this.selectedSubTipo3 !== null) {
        return this.compararSubtipos(this.selectedSubTipo3, carta);
      }

      return false;
    });
  }

  subtipoSeleccionado(id1, id2, id3, carta) {
    if(id1 !== null) {
      return this.compararSubtipos(id1, carta);
    }
    if(id2 !== null) {
      return this.compararSubtipos(id2, carta);
    }
    if(id3 !== null) {
      return this.compararSubtipos(id3, carta);
    }

    return false;
  }

  compararSubtipos(idSubtipo: number, carta: Carta) {
    if(carta.subtipo && carta.subtipo2 && carta.subtipo3) {
      if(carta.subtipo.idSubTipo == idSubtipo || carta.subtipo2.idSubTipo == idSubtipo || carta.subtipo3.idSubTipo == idSubtipo) {
        return true
      } else {
        return false;
      }
    } else {
      if(carta.subtipo2 && carta.subtipo3) {
        if(carta.subtipo2.idSubTipo == idSubtipo || carta.subtipo3.idSubTipo == idSubtipo) {
          return true
        } else {
          return false;
        }
      } else {
        if(carta.subtipo && carta.subtipo3) {
          if(carta.subtipo.idSubTipo == idSubtipo || carta.subtipo3.idSubTipo == idSubtipo) {
            return true
          } else {
            return false;
          }
        } else {
          if(carta.subtipo && carta.subtipo2) {
            if(carta.subtipo.idSubTipo == idSubtipo || carta.subtipo2.idSubTipo == idSubtipo) {
              return true
            } else {
              return false;
            }
          } else {
            if(carta.subtipo) {
              if(carta.subtipo.idSubTipo == idSubtipo) {
                return true
              } else {
                return false;
              }
            }
            if(carta.subtipo2) {
              if(carta.subtipo2.idSubTipo == idSubtipo) {
                return true
              } else {
                return false;
              }
            }
            if(carta.subtipo3) {
              if(carta.subtipo3.idSubTipo == idSubtipo) {
                return true
              } else {
                return false;
              }
            } else {
              return false;
            }
          }
        }
      }
    }

  }

  obtenerCartas() {
    this.conexion.getTodasLasCartasOrdenadas().subscribe((dato) => {
      this.cartas = dato;
      this.costes = this.getUniqueCostesCartas(this.cartas);
      this.costes = this.costes.sort((a, b) => b - a);
    });
  }

  getUniqueCostesCartas(cartas: Carta[]): number[] {
    let costes: number[] = cartas.map(carta => carta.costeCarta);
    let uniqueCostes: number[] = [...new Set(costes)];
    return uniqueCostes;
  }

  onImageLoad(event: Event) {
    const imageElement = event.target as HTMLImageElement;
    const elementRef = new ElementRef(imageElement);
    elementRef.nativeElement.classList.add('fade-in');
  }

}

