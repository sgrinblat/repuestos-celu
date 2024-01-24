import { Component, OnInit } from '@angular/core';
import { Calendario } from 'src/app/calendario';
import { ConexionService } from 'src/app/service/conexion.service';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit {

  calendarios: Calendario[] = [];
  calendariosFiltrados: Calendario[] = [];
  filtroUbicacion: string = '';

  constructor(private conexion: ConexionService) {}

  ngOnInit(): void {
    this.conexion.getEventosPorFecha().subscribe(
      (data: Calendario[]) => {
        this.calendarios = data;
        this.calendariosFiltrados = data; // Inicializa con todos los eventos
      },
      error => {
        //console.error('Error al obtener eventos', error);
      }
    );
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

}
