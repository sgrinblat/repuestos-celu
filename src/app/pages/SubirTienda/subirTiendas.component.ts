import { Component, OnInit, Renderer2, ViewChild, ElementRef, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ConexionService } from 'src/app/service/conexion.service';
import Swal from 'sweetalert2';
import { Tienda } from '../../tienda';


@Component({
  selector: 'app-subirTiendas',
  templateUrl: './subirTiendas.component.html',
  styleUrls: ['./subirTiendas.component.css']
})
export class SubirTiendasComponent implements OnInit {

  contactForm!: FormGroup;
  tiendas: Tienda[];
  tienda: Tienda = new Tienda();
  p: number = 1;

  @Input()
  nombreInput: string;

  @Output()
  nombreInputChange = new EventEmitter<string>();

  constructor(private conexion: ConexionService, private readonly fb: FormBuilder, private activatedRoute: ActivatedRoute, private route: Router) {
    this.contactForm = fb.group({
      formularioTiendaNombre: ['', [Validators.required, Validators.minLength(3)]],
      formularioTiendaLogo: ['', [Validators.required, Validators.minLength(3)]],
      formularioTiendaMapa: ['', [Validators.required, Validators.minLength(3)]],
      formularioTiendaDireccion: ['', [Validators.required, Validators.minLength(3)]],
      formularioTiendaUrl: ['', [Validators.required, Validators.minLength(3)]]
    });
  }
  ngOnInit() {
    this.obtenerTiendas();
  }

  obtenerTiendas() {
    this.conexion.getTodasLasTiendas().subscribe((dato) => {
      this.tiendas = dato;
    });
  }

  onSubmitTipo() {
    this.subirTienda();
    this.limpiarFormulario();
  }

  subirTienda() {
    this.tienda.nombreTienda = this.contactForm.value.formularioTiendaNombre;
    this.tienda.nombreTienda = this.tienda.nombreTienda.toUpperCase();
    this.tienda.logoTienda = this.contactForm.value.formularioTiendaLogo;
    this.tienda.mapaTienda = this.contactForm.value.formularioTiendaMapa;
    this.tienda.direccionTienda = this.contactForm.value.formularioTiendaDireccion;
    this.tienda.urlTienda = this.contactForm.value.formularioTiendaUrl;

    this.conexion.postTienda(this.tienda).subscribe(
      (dato) => {
        console.log(dato);
        this.obtenerTiendas();
      },
      (error) => console.log(error)
    );
  }

  limpiarFormulario() {
    this.contactForm.reset();
  }

  eliminarTienda(id: number) {
    this.conexion.deleteTienda(id).subscribe(
      (dato) => {
        console.log(dato);
        this.obtenerTiendas();
        Swal.fire('Tienda eliminada',`La tienda ha sido eliminada con exito`, `success`);
      },
      (error) => console.log(error)
    );
  }

  actualizarTienda(id: number) {
    this.route.navigate(['v1/upload/actualizar/subirTienda', id]);
  }

  deslogear() {
    this.conexion.deslogear();
    this.route.navigate(['v1/login']);
  }

}
