import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ConexionService } from 'src/app/service/conexion.service';
import { JugadorGuard } from 'src/app/service/jugador.guard';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {


  constructor( private renderer2 : Renderer2, private conexion: ConexionService, private route: Router) { }

  ngOnInit() {

  }

  verElemento() {
    if(this.conexion.sesionIniciadaJugador()){
      return true;
    } else {
      return false;
    }
  }

  cerrarSesion() {
    this.conexion.deslogear();
    Swal.fire('Sesión cerrada',`Esperamos verte pronto!`, `info`);
    this.route.navigate(['']);
  }

}

