import { Component, OnInit, Renderer2, ViewChild, ElementRef, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Jugador } from 'src/app/jugador';

import { ConexionService } from 'src/app/service/conexion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-torneos',
  templateUrl: './torneos.component.html',
  styleUrls: ['./torneos.component.css']
})
export class TorneosComponent implements OnInit {

  contactForm!: FormGroup;
  contactFormPartidos!: FormGroup;
  p: number = 1;
  jugadores: Jugador[];
  jugadoresPorNombre: Jugador[];

  jugador: Jugador = new Jugador();
  jugadorGanador: Jugador = new Jugador();
  jugadorPerdedor: Jugador = new Jugador();

  @Input()
  nombreInput: string;
  apellidoInput: string;


  @Output()
  nombreInputChange = new EventEmitter<string>();

  constructor(private conexion: ConexionService, private readonly fb: FormBuilder, private activatedRoute: ActivatedRoute, private route: Router) {
    this.contactForm = fb.group({
      formularioNombre: ['', [Validators.required, Validators.minLength(3)]],
      formularioApellido: ['', [Validators.required, Validators.minLength(3)]],
      formularioGID: ['', [Validators.required]]
    });

    this.contactFormPartidos = fb.group({
      formularioJugadorGanador: ['', [Validators.required]],
      formularioJugadorPerdedor: ['', [Validators.required]],
    });

  }
  ngOnInit() {
    this.mostrarJugadores();
  }

  mostrarJugadores() {
    this.conexion.getJugadoresPorPuntos().subscribe((dato) => {
      this.jugadores = dato;
    });

    this.conexion.getJugadoresPorNombre().subscribe((dato) => {
      this.jugadoresPorNombre = dato;
    });
  }

  onSubmitJugador() {
    this.subirJugador();
    this.limpiarFormulario();
  }

  subirJugador() {

    for(let i = 0; i < this.provincias.length; i++) {
      if(this.contactForm.value.formularioGID == this.provincias[i].nombre) {
        this.jugador.gid = this.provincias[i].id;
      }
    }

    this.jugador.nombre = this.contactForm.value.formularioNombre;
    this.jugador.apellido = this.contactForm.value.formularioApellido;
    this.jugador.rango = 1;
    this.jugador.puntos = 0;
    this.jugador.puntosApertura = 0;

    console.log(this.jugador);

    this.conexion.saveJugador(this.jugador).subscribe(
      (dato) => {
        Swal.fire('Jugador guardado',`El jugador ha sido guardado con exito`, `success`);
        this.mostrarJugadores();
      },
      (error) => {
        Swal.fire('No se guardó',`No se pudo guardar. Revise si el GID está repetido`, `error`);
        console.log(error)
      }
    );
  }

  limpiarFormulario() {
    this.contactForm.reset();
  }

  eliminarJugador(id: number) {
    this.conexion.deleteJugador(id).subscribe(
      (dato) => {
        console.log(dato);
        this.mostrarJugadores();
        Swal.fire('Jugador eliminado',`El jugador ha sido eliminada con exito`, `success`);
      },
      (error) => console.log(error)
    );
  }

  actualizarJugador(id: number) {
    this.route.navigate(['v1/upload/actualizar/jugador', id]);
  }


  enviarResultadosPartido() {

    this.jugadorGanador = this.contactFormPartidos.get('formularioJugadorGanador').value;
    this.jugadorPerdedor = this.contactFormPartidos.get('formularioJugadorPerdedor').value;

    if(this.jugadorGanador && this.jugadorPerdedor) {
        this.conexion.registrarResultadoPartido(this.jugadorGanador.id, this.jugadorPerdedor.id).subscribe(
            data => {
              Swal.fire('Partido registrado',`Ya puedes ver el ranking actualizado`, `success`);
              this.mostrarJugadores()
            }, // aquí puedes manejar la respuesta del servidor
            error => console.error(error) // aquí puedes manejar cualquier error que ocurra
        );
    } else {
        console.log("Debes seleccionar tanto un ganador como un perdedor.");
    }

}

  deslogear() {
    this.conexion.deslogear();
    this.route.navigate(['v1/login']);
  }

  getProvinciaNombre(id: string): string {
    const provincia = this.provincias.find(p => p.id === id);
    return provincia ? provincia.nombre : '';
  }


  provincias: Provincia[] = [
    { id: '01', nombre: 'Buenos Aires' },
    { id: '02', nombre: 'Córdoba' },
    { id: '03', nombre: 'Santa Fe' },
    { id: '04', nombre: 'Mendoza' },
    { id: '05', nombre: 'Tucumán' },
    { id: '06', nombre: 'Entre Ríos' },
    { id: '07', nombre: 'Salta' },
    { id: '08', nombre: 'Misiones' },
    { id: '09', nombre: 'Chaco' },
    { id: '10', nombre: 'Corrientes' },
    { id: '11', nombre: 'Santiago del Estero' },
    { id: '12', nombre: 'San Juan' },
    { id: '13', nombre: 'Jujuy' },
    { id: '14', nombre: 'Río Negro' },
    { id: '15', nombre: 'Neuquén' },
    { id: '16', nombre: 'Formosa' },
    { id: '17', nombre: 'Chubut' },
    { id: '18', nombre: 'San Luis' },
    { id: '19', nombre: 'Catamarca' },
    { id: '20', nombre: 'La Rioja' },
    { id: '21', nombre: 'La Pampa' },
    { id: '22', nombre: 'Santa Cruz' },
    { id: '23', nombre: 'Tierra del Fuego' }
  ];

  provinciaSeleccionada: Provincia | null = null;

}

export interface Provincia {
  id: string;
  nombre: string;
}

