import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import Swal from 'sweetalert2';

import { ConexionService } from '../../service/conexion.service';
import { Rareza } from '../../rareza';

@Component({
  selector: 'app-actualizar-rareza',
  templateUrl: './actualizar-rareza.component.html',
  styleUrls: ['./actualizar-rareza.component.css']
})
export class ActualizarRarezaComponent implements OnInit {

  id: number;
  contactForm!: FormGroup;

  rarezas: Rareza[];
  rareza: Rareza = new Rareza();

  esverdad : boolean = false;

  @Input()
  nombreInput: string;

  @Output()
  nombreInputChange = new EventEmitter<string>();

  constructor(private conexion: ConexionService, private router: Router, private route: ActivatedRoute, private readonly fb: FormBuilder) {
    this.contactForm = fb.group({
      formularioRarezaNombre: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.conexion.getRarezaById(this.id).subscribe(dato =>{
      this.rareza = dato;
      this.rareza.nombreRareza = dato.nombreRareza;

      console.log(dato);

    }, error => console.log(error), () => {
        this.esverdad = true;
        this.rareza.nombreRareza = this.rareza.nombreRareza;
      }
    );
  }

  onSubmit(){
    this.actualizar();
    this.regresarListaRarezas();
  }

  actualizar() {
    this.rareza.nombreRareza = this.contactForm.value.formulariorarezaNombre;
    this.rareza.nombreRareza = this.rareza.nombreRareza.toUpperCase();

    this.conexion.putRareza(this.id, this.rareza).subscribe((dato) => {
      console.log(dato);
      Swal.fire('Rareza actualizada',`La rareza ${this.rareza.nombreRareza} ha sido actualizada con exito`, `success`);
    }, error => {
      console.log(error);
      Swal.fire('La rareza no pudo ser actualizada', `error`);
    });
  }

  regresarListaRarezas() {
    this.router.navigate(['/v1/upload/rarezas']);
  }
}
