import { Component, OnInit } from '@angular/core';
import { Jugador } from 'src/app/jugador';
import { ConexionService } from 'src/app/service/conexion.service';

@Component({
  selector: 'app-ranking-apertura',
  templateUrl: './ranking-apertura.component.html',
  styleUrls: ['./ranking-apertura.component.css']
})
export class RankingAperturaComponent implements OnInit {
  jugadores: Jugador[];

  constructor(private conexion: ConexionService) { }

  ngOnInit() {
    this.mostrarJugadores();
  }

  mostrarJugadores() {
    this.conexion.getJugadoresPorPuntosApertura().subscribe((dato) => {
      this.jugadores = dato;
    });
  }

}
