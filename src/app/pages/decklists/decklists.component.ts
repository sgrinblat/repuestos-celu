import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ElementRef } from '@angular/core';

import Swal from 'sweetalert2';

import { ConexionService } from 'src/app/service/conexion.service';
import { Carta } from '../../carta';
import { Rareza } from 'src/app/rareza';
import { Expansion } from '../../expansion';
import { Tipo } from '../../tipo';
import { Decklist } from 'src/app/decklist';
import { Usuario } from 'src/app/usuario';

@Component({
  selector: 'app-decklists',
  templateUrl: './decklists.component.html',
  styleUrls: ['./decklists.component.css']
})
export class DecklistsComponent implements OnInit {

  decklists: Decklist[];
  tieneDecks: boolean = false;

  constructor(private conexion: ConexionService, private activatedRoute: ActivatedRoute, private route: Router) { }

  ngOnInit() {
    this.conexion.getUsuarioActual().subscribe((usuario: Usuario) => {
      this.obtenerDecklists(usuario.id);
    });
  }


  obtenerDecklists(id: number) {
    this.conexion.getTodasLasDecklistsDeJugador(id).subscribe((dato) => {
      this.decklists = dato;
      if(this.decklists.length < 1) {
        this.tieneDecks = false;
      } else {
        this.tieneDecks = true;
      }
    });
  }

  selectedDecklistId: number | null = null;

  editarDecklist(deck: Decklist) {
    this.selectedDecklistId = deck.id;
    this.route.navigate(['decklist', this.selectedDecklistId]);
  }

  eliminarDecklist(deck: Decklist) {
    this.conexion.deleteDecklist(deck.id).subscribe(
      (dato) => {
        this.conexion.getUsuarioActual().subscribe((usuario: Usuario) => {
          this.obtenerDecklists(usuario.id);
        });
        Swal.fire('Decklist eliminada',`La decklist ha sido eliminada con exito`, `success`);
      },
      (error) => console.log("Qué estás buscando, picaron?")
    );
  }

  onImgError(event) {
    event.target.src = 'https://i.postimg.cc/Kv927HQV/mente-mejor.jpg';
  }


}
