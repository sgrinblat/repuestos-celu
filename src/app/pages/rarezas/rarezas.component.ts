import { Component, OnInit, Renderer2, ViewChild, ElementRef, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ConexionService } from 'src/app/service/conexion.service';
import Swal from 'sweetalert2';
import { Rareza } from '../../rareza';

@Component({
  selector: 'app-rarezas',
  templateUrl: './rarezas.component.html',
  styleUrls: ['./rarezas.component.css']
})
export class RarezasComponent implements OnInit {
  contactForm!: FormGroup;
  rarezas: Rareza[];
  rareza: Rareza = new Rareza();
  p: number = 1;

  @Input()
  nombreInput: string;

  @Output()
  nombreInputChange = new EventEmitter<string>();

  constructor(private conexion: ConexionService, private readonly fb: FormBuilder, private activatedRoute: ActivatedRoute, private route: Router) {
    this.contactForm = fb.group({
      formularioRarezaNombre: ['', [Validators.required, Validators.minLength(3)]],
    });
  }
  ngOnInit() {
    this.obtenerRarezas();
  }

  obtenerRarezas() {
    this.conexion.getTodasLasRarezas().subscribe((dato) => {
      this.rarezas = dato;
    });
  }

  onSubmitRareza() {
    this.subirRareza();
    this.limpiarFormulario();
  }

  subirRareza() {
    this.rareza.nombreRareza = this.contactForm.value.formularioRarezaNombre;
    this.rareza.nombreRareza = this.rareza.nombreRareza.toUpperCase();

    this.conexion.postRareza(this.rareza).subscribe(
      (dato) => {
        console.log(dato);
        this.obtenerRarezas();
      },
      (error) => console.log(error)
    );
  }

  limpiarFormulario() {
    this.contactForm.reset();
  }

  eliminarRareza(id: number) {
    this.conexion.deleteRareza(id).subscribe(
      (dato) => {
        console.log(dato);
        this.obtenerRarezas();
        Swal.fire('Rareza eliminada',`La rareza ha sido eliminada con exito`, `success`);
      },
      (error) => console.log(error)
    );
  }

  actualizarRareza(id: number) {
    this.route.navigate(['v1/upload/actualizar/rareza', id]);
  }

  deslogear() {
    this.conexion.deslogear();
    this.route.navigate(['v1/login']);
  }

}
