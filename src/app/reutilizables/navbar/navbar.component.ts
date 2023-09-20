import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ConexionService } from 'src/app/service/conexion.service';
import { JugadorGuard } from 'src/app/service/jugador.guard';
import { Usuario } from 'src/app/usuario';
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

  @ViewChild('dropdownMenu', { static: false }) dropdownMenu: ElementRef;

  toggleDropdown(): void {
    const isDisplayed = this.dropdownMenu.nativeElement.style.display === 'block';
    this.dropdownMenu.nativeElement.style.display = isDisplayed ? 'none' : 'block';
  }

  isDropdownVisible = false;

  showDropdown(): void {
    this.dropdownMenu.nativeElement.style.display = 'block';
    this.isDropdownVisible = true;
  }

  hideDropdown(): void {
    this.dropdownMenu.nativeElement.style.display = 'none';
    this.isDropdownVisible = false;
  }

  showGroup(group: string) {
    const groups = document.querySelectorAll('.dropdown-group');
    groups.forEach(g => g.classList.remove('active'));

    const selectedGroup = document.querySelector(`.dropdown-group[data-group="${group}"]`);
    if (selectedGroup) {
        selectedGroup.classList.add('active');
    }
  }


  hideGroups() {
      const groups = document.querySelectorAll('.dropdown-group');
      groups.forEach(g => g.classList.remove('active'));
  }



}

