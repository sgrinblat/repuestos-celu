import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Calendario } from 'src/app/calendario';
import { ConexionService } from 'src/app/service/conexion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-calendarAdmin',
  templateUrl: './calendarAdmin.component.html',
  styleUrls: ['./calendarAdmin.component.css']
})
export class CalendarAdminComponent implements OnInit {
  calendarioForm!: FormGroup;

  calendarios: Calendario[] = [];
  calendariosFiltrados: Calendario[] = [];
  filtroUbicacion: string = '';

  constructor(private conexion: ConexionService, private router: Router, private readonly fb: FormBuilder) { }

  ngOnInit(): void {
    this.calendarioForm = this.fb.group({
      titulo: ['', Validators.required],
      fecha: ['', Validators.required],
      ubicacion: ['', Validators.required],
      categoria: ['', Validators.required],
      organizador: ['', Validators.required]
    });

    this.conexion.getEventosPorFecha().subscribe(
      (data: Calendario[]) => {
        this.calendarios = data;
        this.calendariosFiltrados = data; // Inicializa con todos los eventos
      },
      error => {
        console.error('Error al obtener eventos', error);
      }
    );
  }

  onSubmit(): void {
    if (this.calendarioForm.valid) {

      this.calendarioForm.value.titulo = this.calendarioForm.value.titulo.toUpperCase();
      this.calendarioForm.value.ubicacion = this.calendarioForm.value.ubicacion.toUpperCase();
      this.calendarioForm.value.categoria = this.calendarioForm.value.categoria.toUpperCase();
      this.calendarioForm.value.organizador = this.calendarioForm.value.organizador.toUpperCase();

      const nuevoEvento: Calendario = this.calendarioForm.value;

      this.conexion.postEvento(nuevoEvento).subscribe(
        respuesta => {
          console.log('Evento creado con éxito', respuesta);
          Swal.fire('Evento creado',`Ha sido un exito`, `success`);
          this.ngOnInit();
        },
        error => {
          console.error('Error al crear el evento', error);
          Swal.fire('Hubo un error',`Dios que paso ahora jaja`, `error`);
        }
      );
    }
  }

  ngOnChanges(): void {
    this.filtrarPorUbicacion();
  }

  filtrarPorUbicacion(): void {
    if (!this.filtroUbicacion) {
      this.calendariosFiltrados = this.calendarios;
    } else {
      this.calendariosFiltrados = this.calendarios.filter(calendario =>
        calendario.ubicacion.toUpperCase().includes(this.filtroUbicacion.toUpperCase())
      );
    }
  }


  actualizarEvento(id: number) {
    this.router.navigate(['v1/upload/actualizar/fecha', id]);
  }

  eliminarEvento(id: number) {
    this.conexion.deleteEvento(id).subscribe(
      (dato) => {
        this.ngOnInit();
        Swal.fire('Evento eliminado',`El evento ha sido eliminada con exito`, `success`);
      },
      (error) => console.log("Qué estás buscando, picaron?")
    );
  }

  eliminarEventosAntiguos(): void {
    const hoy = new Date();
    const eventosAEliminar = this.calendarios.filter(evento => {
      const fechaEvento = new Date(evento.fecha);
      const diferenciaDias = (hoy.getTime() - fechaEvento.getTime()) / (1000 * 3600 * 24);
      return diferenciaDias > 15;
    });

    eventosAEliminar.forEach(evento => {
      this.conexion.deleteEvento(evento.id).subscribe(
        () => {
          console.log(`Evento con ID ${evento.id} eliminado.`);
          // Eliminar el evento del array local para actualizar la vista
          this.calendarios = this.calendarios.filter(e => e.id !== evento.id);
          Swal.fire('Eventos eliminados',`El evento ha sido eliminada con exito`, `success`);
          this.ngOnInit();
        },
        error => {
          console.error('Error al eliminar el evento con ID: ' + evento.id, error);
        }
      );
    });
  }

}
