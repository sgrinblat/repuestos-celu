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

  carta: Carta = new Carta();
  expansion: Expansion = new Expansion();
  rareza: Rareza = new Rareza();
  tipo: Tipo = new Tipo();

  @Input()
  nombreInput: string;

  @Output()
  nombreInputChange = new EventEmitter<string>();

  p: number = 1;
  searchText: any;
  searchByExpa: any;
  searchByRare: any;
  searchByType: any;

  resultados: number;

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

  // buscarPorNombre(name: string) {
  //   name = this.nombreInput;
  //   this.conexion.getCartaByPartialName(name).subscribe((dato) => {
  //     console.log(dato);
  //   }, (error) => console.log(error));
  // }

  // valorIngresado: string = "";

  // @Output()
  // valorBuscado: EventEmitter<string> = new EventEmitter<string>();

  // busquedaDeTexto() {
  //   this.valorBuscado.emit(this.valorIngresado);
  // }


  buscarPorExpansion(e, id: number) {
    if(e.target.checked) {
      this.buscarExpansion(id);
      this.resultados = document.querySelectorAll('.idCartaBuscada').length;
    } else {
      this.searchByExpa = "";
    }
  }

  buscarPorRareza(e, id: number) {
    if(e.target.checked) {
      this.buscarRareza(id);
      this.resultados = document.querySelectorAll('.idCartaBuscada').length;
    } else {
      this.searchByRare = "";
    }
  }

  buscarPorTipo(e, id: number) {
    if(e.target.checked) {
      this.buscarTipo(id);
    } else {
      this.searchByType = "";
    }
  }

  buscarExpansion(id: number) {
    this.conexion.getCartaByExpansion(id).subscribe((dato) => {
      this.searchByExpa = dato[0].expansion.nombreExpansion;
    }, (error) => console.log("Qué estás buscando, picaron?"));
  }

  buscarRareza(id: number) {
    this.conexion.getCartaByRareza(id).subscribe((dato) => {
      this.searchByRare = dato[0].rareza.nombreRareza;
    }, (error) => console.log("Qué estás buscando, picaron?"));
  }

  buscarTipo(id: number) {
    this.conexion.getCartaByTipo(id).subscribe((dato) => {
      this.searchByType = dato[0].tipo.nombreTipo;
    }, (error) => console.log("Qué estás buscando, picaron?"));
  }

}


