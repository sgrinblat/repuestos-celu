import { Component, OnInit, Renderer2, ViewChild, ElementRef, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Loading } from 'notiflix';
import { ConexionService } from 'src/app/service/conexion.service';
import { RecaptchaService } from 'src/app/service/recaptcha.service';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnDestroy, OnInit {


  // provincias: string[] = [
  //   'Buenos Aires', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba',
  //   'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa',
  //   'La Rioja', 'Mendoza', 'Misiones', 'Neuquén', 'Río Negro',
  //   'Salta', 'San Juan', 'San Luis', 'Santa Cruz', 'Santa Fe',
  //   'Santiago del Estero', 'Tierra del Fuego', 'Tucumán'
  // ];

  provincias: any[] = [];
  ciudades: any[] = [];

  private listener: Function;

  constructor( private renderer : Renderer2, private recaptchaService: RecaptchaService, private route: Router, private cdr: ChangeDetectorRef, private conexionService: ConexionService) {
    this.listener = this.renderer.listen('document', 'click', (event: Event) => {
      this.handleDocumentClick(event);
    });
  }

  ngOnInit(): void {
    this.loadStates();
  }

  loadStates() {
    this.conexionService.getStates().subscribe(
      response => {
        if (response.status) {
          this.provincias = response.states; // Guarda los estados en el array Provincias
        }
      },
      error => {
        console.error('Error: ', error); // Manejo de errores
      }
    );
  }

  loadCities(idState: number) {
    this.conexionService.getCities(idState).subscribe(
      response => {
        if (response.status) {
          this.ciudades = response.cities;
        }
      },
      error => {
        console.error('Error: ', error);
      }
    );
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


  abrirModalUbicacion() {
    const { provincias, ciudades } = this;
    const screenWidth = window.innerWidth;

    Swal.fire({
      html: `
        <select id="swal-select1" class="swal2-input">
          <option value="">Seleccione una provincia</option>
          ${provincias.map(provincia => `<option value="${provincia.id}">${provincia.name}</option>`).join('')}
        </select><br>
        <select id="swal-select2" class="swal2-input" disabled>
          <option value="">Elige una provincia primero</option>
        </select>
      `,
      position: 'center',
      focusConfirm: false,
      preConfirm: () => {
        return [
          (document.getElementById('swal-select1') as HTMLSelectElement).value,
          (document.getElementById('swal-select2') as HTMLSelectElement).value
        ]
      },
      confirmButtonText: 'OK',
      didOpen: () => {
        const modal = document.querySelector('.swal2-popup');
        const selects = document.querySelectorAll('.swal2-input'); // Selecciona todos los elementos con la clase swal2-input

        if (modal) {
          (modal as HTMLElement).style.borderRadius = '1rem'; // Aplica estilos al modal
        }

        if(screenWidth < 768) {
          selects.forEach(select => {
            (select as HTMLElement).style.fontSize = '11px'; // Aplica estilos a cada select encontrado
          });
        }


        const selectEstado = document.getElementById('swal-select1') as HTMLSelectElement;
        const selectCiudad = document.getElementById('swal-select2') as HTMLSelectElement;

        selectEstado.onchange = () => {
          const selectedId = parseInt(selectEstado.value, 10);
          if (selectedId) {
            this.conexionService.getCities(selectedId).subscribe(response => {
              if (response.status) {
                selectCiudad.innerHTML = response.cities.map(ciudad => {
                  // Reemplazar "Ciudad Autónoma de Buenos Aires" por "CABA"
                  let cityName = ciudad.name;
                  if (cityName === "Ciudad Autónoma de Buenos Aires") {
                    cityName = "CABA";
                  }
                  return `<option value="${ciudad.id}">${cityName}</option>`;
                }).join('');
                selectCiudad.disabled = false;
              }
            });
          } else {
            selectCiudad.innerHTML = '<option value="">Elige una provincia primero</option>';
            selectCiudad.disabled = true;
          }
        };
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
        <p class="mt-3" style="text-align: center;"><a href="/validarcuenta">Necesito validar mi cuenta</a></p>
      `,
      showConfirmButton: false,
      position: 'center',
      didOpen: () => {
        document.getElementById('login-btn').addEventListener('click', () => {
          const email = (document.getElementById('email') as HTMLInputElement).value;
          const password = (document.getElementById('password') as HTMLInputElement).value;
          console.log('Intento de login con:', email, password);
        });

        document.getElementById('register-btn').addEventListener('click', () => {
          Swal.close();
          console.log('Ir al formulario de registro');
          this.route.navigate(['/registro']);
        });

        document.querySelector('a[href="/validarcuenta"]').addEventListener('click', (event) => {
          event.preventDefault();
          this.abrirModalValidacion();
        });

        const modal = document.querySelector('.swal2-popup');
        if(modal) {
          (modal as HTMLElement).style.borderRadius = '1rem';
        }
      }

    });
  }

  buscarProducto() {
    this.route.navigate(['busqueda']);
  }

  abrirModalValidacion() {
    Swal.fire({
      icon: 'info',
      title: 'Validar cuenta',
      html: `
        <button id="ya-tengo-codigo" class="swal2-confirm swal2-styled mt-3" style="display: block; background-color: #28a745; margin: 0.5rem auto;">Ya tengo un código</button>
        <button id="necesito-nuevo-codigo" class="swal2-confirm swal2-styled mt-3" style="display: block; background-color: #dab640; margin: 0.5rem auto;">Necesito un código nuevo</button>
      `,
      showConfirmButton: false,
      position: 'center',
      didOpen: () => {
        document.getElementById('ya-tengo-codigo').addEventListener('click', () => {
          Swal.close();
          this.abrirModalYaTengoCodigo();
        });
        document.getElementById('necesito-nuevo-codigo').addEventListener('click', () => {
          Swal.close();
          this.abrirModalNecesitoNuevoCodigo();
        });
      }
    });
  }

  abrirModalYaTengoCodigo() {
    const inputs = Array.from({ length: 6 }, () =>
      '<input type="text" class="form-control sw-input" style="width: 45px; height: 55px; font-size: 24px; text-align: center; margin: 0 5px;" maxlength="1">'
    ).join('');

    Swal.fire({
      icon: 'info',
      title: 'Ingrese su email y código',
      html: `
        <input id="email-code" class="swal2-input mb-4" placeholder="Dirección de email">
        <div style="display: flex; justify-content: center;">${inputs}</div>
      `,
      focusConfirm: false,
      position: 'center',
      preConfirm: () => {
        const values = Array.from(document.getElementsByClassName('sw-input'), (input) => input['value']);
        if (values.some((value) => !value)) {
          Swal.showValidationMessage("Todos los campos deben estar llenos");
          return false; // Devuelve false si la validación falla
        } else {
          return values.join(''); // Devuelve el valor concatenado si pasa la validación
        }
      },
      allowOutsideClick: false,
      showCloseButton: true,
      confirmButtonText: 'Validar'
    }).then((result) => {
      if (result.value) {
        let numero = result.value;
        // Asegurarse de que el email todavía existe en el DOM
        const emailInput = document.getElementById('email-code') as HTMLInputElement;
        if (!emailInput) {
          console.error('El input de email ya no está disponible.');
          return;
        }
        const email = emailInput.value;
        this.recaptchaService.executeRecaptcha('validate').then(token => {
          this.conexionService.validarCodigo(email, parseInt(numero), token).subscribe({
            next: (response) => {
              Swal.fire('¡Validación exitosa!', 'Tu número ha sido validado.', 'success');
              console.log(response);
            },
            error: (error) => {
              Swal.fire('Error', 'Hubo un problema al validar el código.', 'error');
              console.log(error);
            }
          });
        }).catch(error => {
          console.error('Recaptcha error:', error);
        });
      }
    });

    this.autoTabInputs();
  }

  abrirModalNecesitoNuevoCodigo() {
    Swal.fire({
      icon: 'warning',
      title: 'Ingrese su email y celular',
      html: `
        <input id="email-phone" class="swal2-input" placeholder="Email">
        <input id="codarea" class="swal2-input" placeholder="Cod Area">
        <input id="phone" class="swal2-input" placeholder="Número de celular">
        <button style="background-color: #28a745;" class="swal2-confirm swal2-styled mt-3">Solicitar Nuevo Código</button>
      `,
      showConfirmButton: false,
      showCloseButton: true,
      position: 'center',
      didOpen: () => {
        document.querySelector('.swal2-confirm').addEventListener('click', () => {
          const email = document.getElementById('email-phone') as HTMLInputElement;
          const codarea = document.getElementById('codarea') as HTMLInputElement;
          const phone = document.getElementById('phone') as HTMLInputElement;

          if (!email.value || !codarea.value || !phone.value) {
            Swal.showValidationMessage("Por favor, complete todos los campos antes de continuar.");
            return; // Previene la ejecución del resto del código si falta algún campo
          }
          const codAreaNum = parseInt(codarea.value);
          const phoneNum = parseInt(phone.value);
          if (isNaN(codAreaNum) || isNaN(phoneNum)) {
            Swal.showValidationMessage("Por favor, introduzca números válidos en los campos de área y teléfono.");
            return;
          }

          this.recaptchaService.executeRecaptcha('revalidate').then(token => {
            this.conexionService.revalidarCodigo(email.value, codAreaNum, phoneNum, token).subscribe({
              next: (response) => {
                this.onRegistroExitoso(email.value);
              },
              error: (error) => {
                console.error('Error en el revalidate', error);
              }
            });
          }).catch(error => {
            console.error('Recaptcha error:', error);
          });
        });
      }
    });
  }

  onRegistroExitoso(email: string) {
    const inputs = Array.from({ length: 6 }, () =>
      '<input type="text" class="form-control sw-input" style="width: 45px; height: 55px; font-size: 24px; text-align: center; margin: 0 5px;" maxlength="1">'
    ).join('');

    Swal.fire({
      icon: 'info',
      title: 'Envío exitoso. Valida tu celular con el sms que te enviamos!',
      html: `<div style="display: flex; justify-content: center;">${inputs}</div>`,
      focusConfirm: false,
      showCloseButton: true,
      preConfirm: () => {
        const values = Array.from(document.getElementsByClassName('sw-input'), (input) => input['value']);
        if (values.some((value) => !value)) {
          Swal.showValidationMessage("Todos los campos deben estar llenos");
          return false; // Devuelve false si la validación falla
        } else {
          return values.join(''); // Devuelve el valor concatenado si pasa la validación
        }
      },
      allowOutsideClick: false,
      confirmButtonText: 'Validar'
    }).then((result) => {
      if (result.value) {
        let numero = result.value;
        this.recaptchaService.executeRecaptcha('revalidate').then(token => {

          const num = parseInt(numero);
          if (isNaN(num)) {
            Swal.showValidationMessage("Por favor, introduzca un número válido de código.");
            return;
          }

          this.conexionService.validarCodigo(email, num, token).subscribe({
            next: (response) => {
              Swal.fire('¡Validación exitosa!', 'Tu número ha sido validado.', 'success');
              console.log(response);

            },
            error: (error) => {
              Swal.fire('Error', 'Hubo un problema al validar el código.', 'error');
              console.log(error);
            }
          });
        }).catch(error => {
          console.error('Recaptcha error:', error);
        });

      }
    });

    this.autoTabInputs();
  }


  autoTabInputs() {
    setTimeout(() => {
      const inputs = Array.from(document.getElementsByClassName('sw-input') as HTMLCollectionOf<HTMLInputElement>);
      inputs.forEach((input, idx) => {
        input.addEventListener('input', () => {
          if (input.value.length === 1 && idx < inputs.length - 1) {
            inputs[idx + 1].focus();
          }
        });
      });
    }, 0);
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

