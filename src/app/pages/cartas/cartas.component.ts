import { Component, OnInit, Renderer2, ViewChild, ElementRef, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';

import { ConexionService } from 'src/app/service/conexion.service';
import { Carta } from '../../carta';
import { Rareza } from 'src/app/rareza';
import { Expansion } from '../../expansion';
import { Tipo } from '../../tipo';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-cartas',
  templateUrl: './cartas.component.html',
  styleUrls: ['./cartas.component.css'],
})
export class CartasComponent implements OnInit {

  contactForm!: FormGroup;

  cartas!: Carta[];
  expansiones: Observable<Expansion[]>;
  rarezas: Observable<Rareza[]>;
  tipos: Observable<Tipo[]>;
  searchText: string | null = null;
  selectedRareza: number | null = null;
  selectedExpansion: number | null = null;
  selectedTipo: number | null = null;
  filteredCartas: Carta[] = [];

  carta: Carta = new Carta();

  @Input()
  nombreInput: string;

  @Output()
  nombreInputChange = new EventEmitter<string>();

  constructor(private conexion: ConexionService, private readonly fb: FormBuilder, private activatedRoute: ActivatedRoute, private route: Router) {
    this.contactForm = fb.group({
      formularioCartaNombre: ['', [Validators.required, Validators.minLength(3)]],
      formularioCartaCoste: ['', [Validators.required, Validators.minLength(1)]],
      formularioCartaExpansion: ['', [Validators.required]],
      formularioCartaRareza: ['', [Validators.required]],
      formularioCartaTipo: ['', [Validators.required]],
      formularioCartaURL: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit(): void {
    this.obtenerCartas();
    this.expansiones = this.conexion.getTodasLasExpas();
    this.rarezas = this.conexion.getTodasLasRarezas();
    this.tipos = this.conexion.getTodasLosTipos();
  }

  obtenerCartas() {
    this.conexion.getTodasLasCartas().subscribe((dato) => {
      this.cartas = dato;
    });
  }

  onSubmitCarta() {
    this.subirCarta();
    this.limpiarFormulario();
  }

  subirCarta() {
    this.carta.nombreCarta = this.contactForm.value.formularioCartaNombre;
    this.carta.nombreCarta = this.carta.nombreCarta.toUpperCase();

    this.carta.costeCarta = this.contactForm.value.formularioCartaCoste;
    this.carta.expansion = this.contactForm.value.formularioCartaExpansion;
    this.carta.rareza = this.contactForm.value.formularioCartaRareza;
    this.carta.tipo = this.contactForm.value.formularioCartaTipo;
    this.carta.urlImagen = this.contactForm.value.formularioCartaURL;

    this.conexion.postCarta(this.carta).subscribe(
      (dato) => {
        this.obtenerCartas();
      },
      (error) => console.log("Qué estás buscando, picaron?")
    );
  }

  limpiarFormulario() {
    this.contactForm.reset();
  }

  eliminarCarta(id: number) {
    this.conexion.deleteCarta(id).subscribe(
      (dato) => {
        this.obtenerCartas();
        Swal.fire('Carta eliminada',`La carta ha sido eliminada con exito`, `success`);
      },
      (error) => console.log("Qué estás buscando, picaron?")
    );
  }

  actualizarCarta(id: number) {
    this.route.navigate(['v1/upload/actualizar/carta', id]);
  }

  deslogear() {
    this.conexion.deslogear();
    this.route.navigate(['v1/login']);
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

}


