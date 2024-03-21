import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

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


  provincias: string[] = [
    'Buenos Aires', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba',
    'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa',
    'La Rioja', 'Mendoza', 'Misiones', 'Neuquén', 'Río Negro',
    'Salta', 'San Juan', 'San Luis', 'Santa Cruz', 'Santa Fe',
    'Santiago del Estero', 'Tierra del Fuego', 'Tucumán'
  ];

  // Otro array para el segundo desplegable
  otroArray: string[] = ['Opción 1', 'Opción 2', 'Opción 3'];


  abrirModalUbicacion() {
    const { provincias, otroArray } = this;
    Swal.fire({
      html: `
        <select id="swal-select1" class="swal2-input">
          ${provincias.map(provincia => `<option value="${provincia}">${provincia}</option>`).join('')}
        </select>
        <select id="swal-select2" class="swal2-input">
          ${otroArray.map(opcion => `<option value="${opcion}">${opcion}</option>`).join('')}
        </select>
      `,
      focusConfirm: false,
      preConfirm: () => {
        return [
          (document.getElementById('swal-select1') as HTMLSelectElement).value,
          (document.getElementById('swal-select2') as HTMLSelectElement).value
        ]
      },
      confirmButtonText: 'OK',
      didOpen: () => {
        const confirmButton = document.querySelector('.swal2-confirm');
        const modal = document.querySelector('.swal2-popup');
        if(modal) {
          (modal as HTMLElement).style.borderRadius = '2rem';
        }

        if (confirmButton) {
          (confirmButton as HTMLElement).style.backgroundColor = '#DBB641'; // Ejemplo aplicando estilo directamente
        }
      }
    }).then((result) => {
      if (result.value) {
        const [seleccion1, seleccion2] = result.value;
        console.log(seleccion1, seleccion2);
        // Maneja las selecciones
      }
    });
  }

  abrirModalInicio() {
    Swal.fire({
      title: 'Inicio de Sesión',
      html: `
        <img src="ruta-a-tu-imagen.jpg" alt="imagen" style="max-width: 100%; margin-bottom: 1rem;">
        <input id="email" class="swal2-input" placeholder="Dirección de email">
        <input id="password" class="swal2-input" placeholder="Contraseña" type="password">
        <button id="login-btn" class="swal2-confirm swal2-styled" style="display: block; margin: 0.5rem auto;">ENTRAR</button>
        <button id="register-btn" class="swal2-confirm swal2-styled" style="display: block; background-color: #28a745; margin: 0.5rem auto;">REGISTRATE</button>
        <p style="text-align: center;">¿Olvidaste tu contraseña? Te enviamos un email <a href="link-recuperacion">aquí</a></p>
      `,
      showConfirmButton: false, // Oculta el botón de confirmar por defecto
      customClass: {
        popup: 'mi-modal-personalizado',
        // Aquí puedes agregar más clases personalizadas si necesitas
      },
      didOpen: () => {
        document.getElementById('login-btn').addEventListener('click', () => {
          // Lógica para manejar el evento de "ENTRAR"
          const email = (document.getElementById('email') as HTMLInputElement).value;
          const password = (document.getElementById('password') as HTMLInputElement).value;
          console.log('Intento de login con:', email, password);
          // Aquí debes añadir tu lógica de validación o autenticación
        });

        document.getElementById('register-btn').addEventListener('click', () => {
          // Lógica para manejar el evento de "REGISTRATE"
          console.log('Ir al formulario de registro');
          // Aquí debes añadir tu lógica para dirigir al usuario al registro
        });
      }
    });
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

