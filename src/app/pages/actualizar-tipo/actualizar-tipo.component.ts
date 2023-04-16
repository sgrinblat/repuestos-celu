import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import Swal from 'sweetalert2';

import { ConexionService } from '../../service/conexion.service';
import { Tipo } from '../../tipo';

@Component({
  selector: 'app-actualizar-tipo',
  templateUrl: './actualizar-tipo.component.html',
  styleUrls: ['./actualizar-tipo.component.css']
})
export class ActualizarTipoComponent implements OnInit {

  id: number;
  contactForm!: FormGroup;

  tipos: Tipo[];
  tipo: Tipo = new Tipo();

  esverdad : boolean = false;

  @Input()
  nombreInput: string;

  @Output()
  nombreInputChange = new EventEmitter<string>();

  constructor(private conexion: ConexionService, private router: Router, private route: ActivatedRoute, private readonly fb: FormBuilder) {
    this.contactForm = fb.group({
      formularioTipoNombre: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.conexion.getTipoById(this.id).subscribe(dato =>{
      this.tipo = dato;
      this.tipo.nombreTipo = dato.nombreTipo;

      console.log(dato);

    }, error => console.log(error), () => {
        this.esverdad = true;
        this.tipo.nombreTipo = this.tipo.nombreTipo;
      }
    );
  }

  onSubmit(){
    this.actualizar();
    this.regresarListaTipos();
  }

  actualizar() {
    this.tipo.nombreTipo = this.contactForm.value.formularioTipoNombre;
    this.tipo.nombreTipo = this.tipo.nombreTipo.toUpperCase();

    this.conexion.putTipo(this.id, this.tipo).subscribe((dato) => {
      console.log(dato);
      Swal.fire('Tipo actualizado',`El tipo ${this.tipo.nombreTipo} ha sido actualizada con exito`, `success`);
    }, error => {
      console.log(error);
      Swal.fire('El tipo no pudo ser actualizado', `error`);
    });
  }

  regresarListaTipos() {
    this.router.navigate(['/v1/upload/tipos']);
  }
}
