import { Component, OnInit, Renderer2, ViewChild, ElementRef, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnDestroy {
  private listener: Function;

  constructor( private renderer : Renderer2, private route: Router, private cdr: ChangeDetectorRef) {
    this.listener = this.renderer.listen('document', 'click', (event: Event) => {
      this.handleDocumentClick(event);
    });
  }

  ngOnDestroy() {
    // Remove the listener!
    if (this.listener) {
      this.listener();
    }
  }

  handleDocumentClick(event: Event) {
    const targetElement = event.target as HTMLElement;
    const menuElement = document.querySelector('.menu-container');
    const menuCategorias = document.querySelector('.menu-categorias-container');
    const menuRepuestos = document.querySelector('.menu-repuestos-container');
    const menuAccesorios = document.querySelector('.menu-accesorios-container');

    // Comprueba si el clic fue dentro del menú o sus descendientes
    if (menuElement && !menuElement.contains(targetElement)
    && menuCategorias && !menuCategorias.contains(targetElement)
    && menuRepuestos && !menuRepuestos.contains(targetElement)
    && menuAccesorios && !menuAccesorios.contains(targetElement)  ) {
      this.menuVisible = false;
      this.menuCategoriasVisible = false;
      this.menuRepuestosVisible = false;
      this.menuAccesoriosVisible = false;
      // Necesitas decirle a Angular que detecte los cambios ya que esto no ocurre en la zona de Angular
      this.cdr.detectChanges();
    }
  }

  menuVisible: boolean = false;
  menuCategoriasVisible: boolean = false;
  menuRepuestosVisible: boolean = false;
  menuAccesoriosVisible: boolean = false;

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    this.menuVisible = !this.menuVisible;
    if (this.menuCategoriasVisible) {
      this.menuCategoriasVisible = false;
      if(this.menuRepuestosVisible) {
        this.menuRepuestosVisible = false;
      }
      if(this.menuAccesoriosVisible) {
        this.menuAccesoriosVisible = false;
      }
    }
  }

  toggleMenuCategorias(event: MouseEvent) {
    event.stopPropagation();
    this.menuCategoriasVisible = !this.menuCategoriasVisible;
    if(this.menuRepuestosVisible) {
      this.menuRepuestosVisible = false;
    }
    if(this.menuAccesoriosVisible) {
      this.menuAccesoriosVisible = false;
    }
  }

  toggleMenuRepuestos(event: MouseEvent) {
    event.stopPropagation();
    if(this.menuAccesoriosVisible) {
      this.menuAccesoriosVisible = false;
    }
    this.menuRepuestosVisible = !this.menuRepuestosVisible;
  }
  toggleMenuAccesorios(event: MouseEvent) {
    event.stopPropagation();
    if(this.menuRepuestosVisible) {
      this.menuRepuestosVisible = false;
    }
    this.menuAccesoriosVisible = !this.menuAccesoriosVisible;
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
          (modal as HTMLElement).style.borderRadius = '1rem';
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
        <img width="50" src="../../../assets/images/icons/user.png" alt="imagen"><br>
        <input id="email" class="swal2-input mt-3" placeholder="Dirección de email">
        <input id="password" class="swal2-input mt-3" placeholder="Contraseña" type="password">
        <button id="login-btn" class="swal2-confirm swal2-styled mt-3" style="display: block; background-color: #28a745; margin: 0.5rem auto;">ENTRAR</button>
        <button id="register-btn" class="swal2-confirm swal2-styled mt-3" style="display: block;  margin: 0.5rem auto;">REGISTRATE</button>
        <p class="mt-3" style="text-align: center;"><i>¿Olvidaste tu contraseña? Te enviamos un email <a style="text-decoration: none; color: #333" href="link-recuperacion"><b>aquí</b></i></a></p>
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
        const modal = document.querySelector('.swal2-popup');
        if(modal) {
          (modal as HTMLElement).style.borderRadius = '1rem';
        }

        document.getElementById('register-btn').addEventListener('click', () => {
          // Lógica para manejar el evento de "REGISTRATE"
          Swal.close();
          console.log('Ir al formulario de registro');
          this.route.navigate(['/registro']);
        });
      }
    });
  }

  buscarProducto() {
    this.route.navigate(['busqueda']);
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

