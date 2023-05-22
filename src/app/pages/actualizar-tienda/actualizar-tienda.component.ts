import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import Swal from 'sweetalert2';

import { ConexionService } from '../../service/conexion.service';
import { Tienda } from 'src/app/tienda';

@Component({
  selector: 'app-actualizar-tienda',
  templateUrl: './actualizar-tienda.component.html',
  styleUrls: ['./actualizar-tienda.component.css']
})
export class ActualizarTiendaComponent implements OnInit {

  id: number;
  contactForm!: FormGroup;

  tiendas: Tienda[];
  tienda: Tienda = new Tienda();

  esverdad : boolean = false;

  @Input()
  nombreInput: string;

  @Output()
  nombreInputChange = new EventEmitter<string>();

  constructor(private conexion: ConexionService, private router: Router, private route: ActivatedRoute, private readonly fb: FormBuilder) {
    this.contactForm = fb.group({
      formularioTiendaNombre: ['', [Validators.required, Validators.minLength(3)]],
      formularioTiendaLogo: ['', [Validators.required, Validators.minLength(3)]],
      formularioTiendaMapa: ['', [Validators.required, Validators.minLength(3)]],
      formularioTiendaDireccion: ['', [Validators.required, Validators.minLength(3)]],
      formularioTiendaUrl: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.conexion.getTiendaById(this.id).subscribe(dato =>{
      this.tienda = dato;
      this.tienda.nombreTienda = dato.nombreTienda;

      console.log(dato);

    }, error => console.log(error), () => {
        this.esverdad = true;
        this.tienda.nombreTienda = this.tienda.nombreTienda;
      }
    );
  }

  onSubmit(){
    this.actualizar();
    this.regresarListaTiendas();
  }

  actualizar() {
    this.tienda.nombreTienda = this.contactForm.value.formularioTiendaNombre;
    this.tienda.nombreTienda = this.tienda.nombreTienda.toUpperCase();
    this.tienda.nombreTienda = this.contactForm.value.formularioTiendaNombre;
    this.tienda.nombreTienda = this.tienda.nombreTienda.toUpperCase();
    this.tienda.logoTienda = this.contactForm.value.formularioTiendaLogo;
    this.tienda.mapaTienda = this.contactForm.value.formularioTiendaMapa;
    this.tienda.direccionTienda = this.contactForm.value.formularioTiendaDireccion;
    this.tienda.urlTienda = this.contactForm.value.formularioTiendaUrl;

    this.conexion.putTienda(this.id, this.tienda).subscribe((dato) => {
      console.log(dato);
      Swal.fire('Tienda actualizado',`La Tienda ${this.tienda.nombreTienda} ha sido actualizada con exito`, `success`);
    }, error => {
      console.log(error);
      Swal.fire('La Tienda no pudo ser actualizado', `error`);
    });
  }

  regresarListaTiendas() {
    this.router.navigate(['/v1/upload/subirTiendas']);
  }

}
