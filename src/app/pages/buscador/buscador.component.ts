import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ElementRef } from '@angular/core';

import { ConexionService } from 'src/app/service/conexion.service';
import { Carta } from '../../carta';
import { Rareza } from 'src/app/rareza';
import { Expansion } from '../../expansion';
import { Tipo } from '../../tipo';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css']
})
export class BuscadorComponent implements OnInit {

  searchText: string | null = null;
  selectedRareza: number | null = null;
  selectedExpansion: number | null = null;
  selectedTipo: number | null = null;
  filteredCartas: Carta[] = [];
  cartas!: Carta[];
  expansiones: Observable<Expansion[]>;
  rarezas: Observable<Rareza[]>;
  tipos: Tipo[] = [];


  constructor(private conexion: ConexionService, private activatedRoute: ActivatedRoute, private route: Router) { }

  ngOnInit(): void {
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

  onImageLoad(event: Event) {
    const imageElement = event.target as HTMLImageElement;
    const elementRef = new ElementRef(imageElement);
    elementRef.nativeElement.classList.add('fade-in');
  }

}
