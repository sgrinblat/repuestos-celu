import { Component, OnInit } from '@angular/core';
import { Jugador } from 'src/app/jugador';
import { ConexionService } from 'src/app/service/conexion.service';

@Component({
  selector: 'app-ranking-liga',
  templateUrl: './ranking-liga.component.html',
  styleUrls: ['./ranking-liga.component.css']
})
export class RankingLigaComponent implements OnInit {
  jugadores: Jugador[];

  constructor(private conexion: ConexionService) { }

  ngOnInit() {
    this.mostrarJugadores();
  }

  mostrarJugadores() {
    this.conexion.getJugadoresPorPuntos().subscribe((dato) => {
      this.jugadores = dato;
    });
  }
}
