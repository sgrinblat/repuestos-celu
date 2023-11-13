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


  editarDecklist(deck: Decklist) {
    this.route.navigate(['decklist', deck.id]);
  }

  eliminarDecklist(deck: Decklist) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción eliminará la decklist permanentemente",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            this.conexion.deleteDecklist(deck.id).subscribe(
                (dato) => {
                    this.conexion.getUsuarioActual().subscribe((usuario: Usuario) => {
                        this.obtenerDecklists(usuario.id);
                    });
                    Swal.fire(
                        'Eliminada',
                        'La decklist ha sido eliminada con éxito',
                        'success'
                    );
                },
                (error) => console.log("Qué estás buscando, picaron?")
            );
        }
    });
  }


  onImgError(event) {
    event.target.src = 'https://i.postimg.cc/Kv927HQV/mente-mejor.jpg';
  }


}
