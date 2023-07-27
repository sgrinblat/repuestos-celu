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

@Component({
  selector: 'app-actualizar-carta',
  templateUrl: './actualizar-carta.component.html',
  styleUrls: ['./actualizar-carta.component.css']
})
export class ActualizarCartaComponent implements OnInit {

  id: number;
  contactForm!: FormGroup;

  cartas!: Carta[];
  expansiones: Observable<Expansion[]>;
  rarezas: Observable<Rareza[]>;
  tipos: Observable<Tipo[]>;

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
      formularioCartaURL: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.expansiones = this.conexion.getTodasLasExpas();
    this.rarezas = this.conexion.getTodasLasRarezas();
    this.tipos = this.conexion.getTodasLosTipos();

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

// interface Dato {
//     "idCarta": 0,
//     "nombreCarta": "",
//     "costeCarta": 0,
//     "urlImagen": "",
//     "expansion": {
//         "idExpansion": 0,
//         "nombreExpansion": "",
//         "fechaLanzamiento": ""
//     },
//     "tipo": {
//         "idTipo": 0,
//         "nombreTipo": ""
//     },
//     "rareza": {
//         "idRareza": 0,
//         "nombreRareza": ""
//     }
// }

