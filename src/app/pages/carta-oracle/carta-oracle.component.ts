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
  selector: 'app-carta-oracle',
  templateUrl: './carta-oracle.component.html',
  styleUrls: ['./carta-oracle.component.css']
})
export class CartaOracleComponent implements OnInit {
  id: number;
  cartas!: Carta[];
  expansiones: Observable<Expansion[]>;
  rarezas: Observable<Rareza[]>;
  tipos: Observable<Tipo[]>;

  carta: Carta = new Carta();
  expansion: Expansion = new Expansion();
  rareza: Rareza = new Rareza();
  tipo: Tipo = new Tipo();

  esverdad : boolean = false;

  constructor(private conexion: ConexionService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.expansiones = this.conexion.getTodasLasExpas();
    this.rarezas = this.conexion.getTodasLasRarezas();
    this.tipos = this.conexion.getTodasLosTipos();

    this.conexion.getCartaByIdPublic(this.id).subscribe(dato =>{
      this.carta = dato;
    }, error => console.log(error), () => {
        this.esverdad = true;
      }
    );
  }

  regresarAlBuscador() {
    this.router.navigate(['buscador']);
  }


}
