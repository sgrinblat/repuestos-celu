import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Calendario } from 'src/app/calendario';
import { ConexionService } from 'src/app/service/conexion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actualizar-evento',
  templateUrl: './actualizar-evento.component.html',
  styleUrls: ['./actualizar-evento.component.css']
})
export class ActualizarEventoComponent implements OnInit {

  calendarioForm!: FormGroup;

  calendario: Calendario;

  id: number;

  constructor(private conexion: ConexionService, private router: Router, private route: ActivatedRoute, private readonly fb: FormBuilder) { }

  ngOnInit(): void {
    this.calendarioForm = this.fb.group({
      titulo: ['', Validators.required],
      fecha: ['', Validators.required],
      ubicacion: ['', Validators.required],
      categoria: ['', Validators.required],
      organizador: ['', Validators.required]
    });

    this.id = this.route.snapshot.params['id'];

    this.conexion.getEventoById(this.id).subscribe(
      (data: Calendario) => {
        this.calendario = data;
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
          Swal.fire('Evento actualizado',`Ha sido un exito`, `success`);
        },
        error => {
          console.error('Error al crear el evento', error);
          Swal.fire('Error actualizando',`No se que paso jaja`, `error`);
        }
      );
    }
  }

}
