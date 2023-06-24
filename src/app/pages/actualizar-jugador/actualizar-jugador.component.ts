import { Component, OnInit, Renderer2, ViewChild, ElementRef, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Jugador } from 'src/app/jugador';

import { ConexionService } from 'src/app/service/conexion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actualizar-jugador',
  templateUrl: './actualizar-jugador.component.html',
  styleUrls: ['./actualizar-jugador.component.css']
})
export class ActualizarJugadorComponent implements OnInit {
  id: number;
  dni: string;
  contactForm!: FormGroup;

  jugadores: Jugador[];

  jugador: Jugador = new Jugador();

  esverdad : boolean = false;

  @Input()
  nombreInput: string;
  apellidoInput: string;

  @Output()
  nombreInputChange = new EventEmitter<string>();

  constructor(private conexion: ConexionService, private router: Router, private route: ActivatedRoute, private readonly fb: FormBuilder) {
    this.contactForm = fb.group({
      formularioNombre: ['', [Validators.required, Validators.minLength(3)]],
      formularioApellido: ['', [Validators.required, Validators.minLength(3)]],
      formularioDNI: ['', [Validators.required, Validators.minLength(8)]],
      formularioRango: ['', [Validators.required, Validators.minLength(1)]],
      formularioPuntos: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.conexion.getJugadorById(this.id).subscribe(dato =>{
      this.jugador = dato;
      this.jugador.nombre = dato.nombre;
      this.jugador.apellido = dato.apellido;
      this.jugador.dni = dato.dni;
      this.jugador.rango = dato.rango;
      this.jugador.puntos = dato.puntos;

      console.log(dato);

    }, error => console.log(error), () => {
        this.esverdad = true;
        this.jugador.nombre = this.jugador.nombre;
      }
    );
  }

  onSubmit(){
    this.actualizar();
    this.regresarListaJugadores();
  }

  actualizar() {
    this.jugador.nombre = this.contactForm.value.formularioNombre;
    this.jugador.apellido = this.contactForm.value.formularioApellido;
    this.jugador.dni = this.contactForm.value.formularioDNI;
    this.jugador.rango = this.contactForm.value.formularioRango;
    this.jugador.puntos = this.contactForm.value.formularioPuntos;

    this.conexion.putJugador(this.jugador.dni, this.jugador).subscribe((dato) => {
      console.log(dato);
      Swal.fire('Jugador actualizado',`El jugador ${this.jugador.nombre} ${this.jugador.apellido} ha sido actualizada con exito`, `success`);
    }, error => {
      console.log(error);
      Swal.fire('El jugador no pudo ser actualizado', `error`);
    });
  }

  regresarListaJugadores() {
    this.router.navigate(['/v1/upload/ranking']);
  }
}
