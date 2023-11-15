import { Component, OnInit, Renderer2, ViewChild, ElementRef, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ConexionService } from 'src/app/service/conexion.service';
import Swal from 'sweetalert2';
import { Tipo } from '../../tipo';
import { Subtipo } from 'src/app/subtipo';


@Component({
  selector: 'app-tipos',
  templateUrl: './tipos.component.html',
  styleUrls: ['./tipos.component.css']
})
export class TiposComponent implements OnInit {

  contactForm!: FormGroup;
  contactFormSubtipo!: FormGroup;
  tipos: Tipo[];
  tipo: Tipo = new Tipo();

  subtipos: Subtipo[];
  subtipo: Subtipo = new Subtipo();

  p: number = 1;

  @Input()
  nombreInput: string;
  nombreInputSubtipo: string;

  @Output()
  nombreInputChange = new EventEmitter<string>();
  nombreInputSubtipoChange = new EventEmitter<string>();

  constructor(private conexion: ConexionService, private readonly fb: FormBuilder, private activatedRoute: ActivatedRoute, private route: Router) {
    this.contactForm = fb.group({
      formularioTipoNombre: ['', [Validators.required, Validators.minLength(3)]],
    });
    this.contactFormSubtipo = fb.group({
      formularioSubTipoNombre: ['', [Validators.required, Validators.minLength(3)]],
    });
  }
  ngOnInit() {
    this.obtenerTipos();
    this.obtenerSubTipos();
  }

  obtenerTipos() {
    this.conexion.getTodasLosTipos().subscribe((dato) => {
      this.tipos = dato;
    });
  }

  obtenerSubTipos() {
    this.conexion.getTodasLosSubTipos().subscribe((dato) => {
      this.subtipos = dato;
    });
  }

  onSubmitTipo() {
    this.subirTipo();
    this.limpiarFormulario();
  }

  onSubmitSubTipo() {
    this.subirSubTipo();
    this.limpiarFormulario();
  }

  subirTipo() {
    this.tipo.nombreTipo = this.contactForm.value.formularioTipoNombre;
    this.tipo.nombreTipo = this.tipo.nombreTipo.toUpperCase();

    this.conexion.postTipo(this.tipo).subscribe(
      (dato) => {
        console.log(dato);
        this.obtenerTipos();
      },
      (error) => console.log(error)
    );
  }

  subirSubTipo() {
    this.subtipo.nombreSubTipo = this.contactFormSubtipo.value.formularioSubTipoNombre;
    this.subtipo.nombreSubTipo = this.subtipo.nombreSubTipo.toUpperCase();

    this.conexion.postSubTipo(this.subtipo).subscribe(
      (dato) => {
        console.log(dato);
        this.obtenerSubTipos();
      },
      (error) => console.log(error)
    );
  }

  limpiarFormulario() {
    this.contactForm.reset();
  }

  eliminarTipo(id: number) {
    this.conexion.deleteTipo(id).subscribe(
      (dato) => {
        console.log(dato);
        this.obtenerTipos();
        Swal.fire('Tipo eliminado',`El Tipo ha sido eliminada con exito`, `success`);
      },
      (error) => console.log(error)
    );
  }

  actualizarTipo(id: number) {
    this.route.navigate(['v1/upload/actualizar/tipo', id]);
  }

  eliminarSubTipo(id: number) {
    this.conexion.deleteSubTipo(id).subscribe(
      (dato) => {
        console.log(dato);
        this.obtenerSubTipos();
        Swal.fire('SubTipo eliminado',`El SubTipo ha sido eliminada con exito`, `success`);
      },
      (error) => console.log(error)
    );
  }

  actualizarSubTipo(id: number) {
    this.route.navigate(['v1/upload/actualizar/tipo', id]);
  }

  deslogear() {
    this.conexion.deslogear();
    this.route.navigate(['v1/login']);
  }

}
