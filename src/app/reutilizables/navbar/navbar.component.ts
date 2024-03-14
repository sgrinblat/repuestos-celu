import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor( private renderer2 : Renderer2, private route: Router) { }

  ngOnInit() {
  }

  menuVisible: boolean = false;

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
    this.animateMenu();
  }

  animateMenu() {
    const menuContainer = document.querySelector('.menu-container');
    if (this.menuVisible) {
      menuContainer.classList.add('visible');
    } else {
      menuContainer.classList.remove('visible');
    }
  }

  // verElemento() {
  //   if(this.conexion.sesionIniciadaJugador()){
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  // cerrarSesion() {
  //   this.conexion.deslogear();
  //   Swal.fire('Sesión cerrada',`Esperamos verte pronto!`, `info`);
  //   this.route.navigate(['']);
  // }


}

