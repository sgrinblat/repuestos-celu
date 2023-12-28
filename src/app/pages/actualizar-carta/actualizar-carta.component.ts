import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';

import Swal from 'sweetalert2';

import { Carta } from '../../carta';
import { Rareza } from 'src/app/rareza';
import { Expansion } from '../../expansion';
import { Tipo } from '../../tipo';

import { ConexionService } from '../../service/conexion.service';
import { Subtipo } from 'src/app/subtipo';

@Component({
  selector: 'app-actualizar-carta',
  templateUrl: './actualizar-carta.component.html',
  styleUrls: ['./actualizar-carta.component.css']
})
export class ActualizarCartaComponent implements OnInit {

  contactForm!: FormGroup;

  id: number;
  cartas!: Carta[];
  expansiones: Observable<Expansion[]>;
  rarezas: Observable<Rareza[]>;
  tipos: Observable<Tipo[]>;
  subtipos: Observable<Subtipo[]>;

  carta: Carta = new Carta();
  expansion: Expansion = new Expansion();
  rareza: Rareza = new Rareza();
  tipo: Tipo = new Tipo();

  esverdad : boolean = false;

  @Input()
  nombreInput: string;

  @Output()
  nombreInputChange = new EventEmitter<string>();

  constructor(private conexion: ConexionService, private router: Router, private route: ActivatedRoute, private readonly fb: FormBuilder) {
    this.contactForm = fb.group({
      formularioCartaNombre: ['', [Validators.required, Validators.minLength(3)]],
      formularioCartaCoste: ['', [Validators.required, Validators.minLength(1)]],
      formularioCartaExpansion: ['', [Validators.required]],
      formularioCartaRareza: ['', [Validators.required]],
      formularioCartaTipo: ['', [Validators.required]],
      formularioCartaSubTipo1: [''],
      formularioCartaSubTipo2: [''],
      formularioCartaSubTipo3: [''],
      formularioTextoCarta: ['', [Validators.required, Validators.minLength(6)]],
      formularioCartaURL: ['', [Validators.required, Validators.minLength(10)]],
      formularioAlter1: [''],
      formularioAlter2: [''],
      formularioAlter3: [''],
      formularioAlter4: [''],
      formularioAlter5: [''],
      formularioAlter6: [''],
      formularioAlter7: [''],
      formularioAlter8: [''],
      formularioAlter9: [''],
      formularioAlter10: [''],
      formularioRulingCarta: [''],
      formularioFlavorCarta: [''],
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.expansiones = this.conexion.getTodasLasExpas();
    this.rarezas = this.conexion.getTodasLasRarezas();
    this.tipos = this.conexion.getTodasLosTipos();

    this.subtipos = this.conexion.getTodasLosSubTipos();

    this.conexion.getCartaById(this.id).subscribe(dato =>{
      this.carta = dato;
      console.log(dato);
    }, error => console.log(error), () => {
        this.esverdad = true;
      }
    );
  }

  onSubmit(){
    this.actualizar();
    this.regresarListaCartas();
  }

  actualizar() {
    this.carta.nombreCarta = this.contactForm.value.formularioCartaNombre;
    this.carta.nombreCarta = this.carta.nombreCarta.toUpperCase();

    this.carta.costeCarta = this.contactForm.value.formularioCartaCoste;
    this.carta.expansion = this.contactForm.value.formularioCartaExpansion;
    this.carta.rareza = this.contactForm.value.formularioCartaRareza;
    this.carta.tipo = this.contactForm.value.formularioCartaTipo;
    this.carta.urlImagen = this.contactForm.value.formularioCartaURL;

    this.carta.subtipo = this.contactForm.value.formularioCartaSubTipo1;

    if(this.contactForm.value.formularioCartaSubTipo2) {
      this.carta.subtipo2 = this.contactForm.value.formularioCartaSubTipo2;
    }
    if(this.contactForm.value.formularioCartaSubTipo3) {
      this.carta.subtipo3 = this.contactForm.value.formularioCartaSubTipo3;
    }

    this.carta.textoCarta = this.contactForm.value.formularioTextoCarta;
    this.carta.flavorCarta = this.contactForm.value.formularioFlavorCarta;
    this.carta.rulingCarta = this.contactForm.value.formularioRulingCarta;
    this.carta.urlImagen1 = this.contactForm.value.formularioAlter1;
    this.carta.urlImagen2 = this.contactForm.value.formularioAlter2;
    this.carta.urlImagen3 = this.contactForm.value.formularioAlter3;
    this.carta.urlImagen4 = this.contactForm.value.formularioAlter4;
    this.carta.urlImagen5 = this.contactForm.value.formularioAlter5;
    this.carta.urlImagen6 = this.contactForm.value.formularioAlter6;
    this.carta.urlImagen7 = this.contactForm.value.formularioAlter7;
    this.carta.urlImagen8 = this.contactForm.value.formularioAlter8;
    this.carta.urlImagen9 = this.contactForm.value.formularioAlter9;
    this.carta.urlImagen10 = this.contactForm.value.formularioAlter10;

    console.log("Quiero ver la carta actualizada");
    console.log(this.carta);

    this.conexion.putCarta(this.id, this.carta).subscribe((dato) => {
      console.log(dato);
      Swal.fire('Carta actualizada',`La carta ${this.carta.nombreCarta} ha sido actualizada con exito`, `success`);
    }, error => {
      console.log(error);
      Swal.fire('La carta no pudo ser actualizada', `error`);
    });
  }

  regresarListaCartas() {
    this.router.navigate(['/v1/upload/cartas']);
  }

}


