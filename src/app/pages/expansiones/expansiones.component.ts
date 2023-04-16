import { Component, OnInit, Renderer2, ViewChild, ElementRef, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ConexionService } from 'src/app/service/conexion.service';
import Swal from 'sweetalert2';
import { Expansion } from '../../expansion';


@Component({
  selector: 'app-expansiones',
  templateUrl: './expansiones.component.html',
  styleUrls: ['./expansiones.component.css']
})
export class ExpansionesComponent implements OnInit {

  contactForm!: FormGroup;
  expansiones: Expansion[];
  expansion: Expansion = new Expansion();
  p: number = 1;

  @Input()
  nombreInput: string;

  @Output()
  nombreInputChange = new EventEmitter<string>();

  constructor(private conexion: ConexionService, private readonly fb: FormBuilder, private activatedRoute: ActivatedRoute, private route: Router) {
    this.contactForm = fb.group({
      formularioExpansionNombre: ['', [Validators.required, Validators.minLength(3)]],
    });
  }
  ngOnInit() {
    this.obtenerExpas();
  }

  obtenerExpas() {
    this.conexion.getTodasLasExpas().subscribe((dato) => {
      this.expansiones = dato;
    });
  }

  onSubmitExpansion() {
    this.subirExpansion();
    this.limpiarFormulario();
  }

  subirExpansion() {
    this.expansion.nombreExpansion = this.contactForm.value.formularioExpansionNombre;
    this.expansion.nombreExpansion = this.expansion.nombreExpansion.toUpperCase();

    const fecha = new Date();
    console.log(fecha);
    this.expansion.fechaLanzamiento = fecha;
    //this.expansion.fechaLanzamiento = `${fecha.getDate()}-${fecha.getMonth}-${fecha.getFullYear}`;

    this.conexion.postExpansion(this.expansion).subscribe(
      (dato) => {
        console.log(dato);
        this.obtenerExpas();
      },
      (error) => console.log(error)
    );
  }

  limpiarFormulario() {
    this.contactForm.reset();
  }

  eliminarExpansion(id: number) {
    this.conexion.deleteExpansion(id).subscribe(
      (dato) => {
        console.log(dato);
        this.obtenerExpas();
        Swal.fire('Expansión eliminada',`La expansión ha sido eliminada con exito`, `success`);
      },
      (error) => console.log(error)
    );
  }

  actualizarExpansion(id: number) {
    this.route.navigate(['v1/upload/actualizar/expansion', id]);
  }

  deslogear() {
    this.conexion.deslogear();
    this.route.navigate(['v1/login']);
  }

}
