import { Component, OnInit, Renderer2, ViewChild, ElementRef, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Loading } from 'notiflix';
import { ConexionService } from 'src/app/service/conexion.service';
import { RecaptchaService } from 'src/app/service/recaptcha.service';


import Swal from 'sweetalert2';
import { ProductService } from '../../service/product.service';
import { NotificationService } from 'src/app/service/notification.service';
import { AuthService } from '../../service/auth.service';


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

  terminoBusqueda: string = undefined;
  subcategoria: number = 0;
  idProv: number = 0;
  idCiudad: number = 0;
  nombreCiudad: string = undefined;

  provincias: any[] = [];
  provincias2: any[] = [];
  ciudades: any[] = [];

  categories = [];
  subcategoriesMap = new Map();
  accesorios = [];
  repuestos = [];

  cartCount: number = 0;
  favCount: number = 0;
  userName: string | null = null;

  private listener: Function;

  constructor( private renderer : Renderer2, private recaptchaService: RecaptchaService, private route: Router,
    private cdr: ChangeDetectorRef, private conexionService: ConexionService,
    private productService: ProductService,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {
    this.listener = this.renderer.listen('document', 'click', (event: Event) => {
      this.handleDocumentClick(event);
    });
  }

  ngOnInit(): void {
    this.loadStates();
    this.loadCategories();

    if(this.authService.sesionIniciada()) {
      this.notificationService.fetchFavCount();
      this.notificationService.fetchCartCount();

      this.notificationService.userData$.subscribe(userData => {
        if (userData) {
          this.userName = userData.name;
        } else {
          this.userName = null;
        }
      });

      this.notificationService.favCount$.subscribe(count => {
        this.favCount = count;
      });
      this.notificationService.cartCount$.subscribe(count => {
        this.cartCount = count;
      });
    }


  }


  loadCategories() {
    this.conexionService.getMenuCategories().subscribe(data => {
      if (data.status) {
        this.categories = data.categories;

        // Filtra y asigna categorías a los arrays correspondientes
        this.accesorios = data.categories.filter(category => category.name === "ACCESORIOS");
        this.repuestos = data.categories.filter(category => category.name === "REPUESTOS");

        // Almacenar subcategorías en un Map para un acceso fácil
        data.categories.forEach(category => {
          this.subcategoriesMap.set(category.id, category.subcategories);
        });
      } else {
        console.log("Error en la carga de categorías: La respuesta no tiene status true.");
      }
    }, error => {
      console.error("Error al cargar categorías desde el servicio:", error);
    });
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
    const menuLogueado = document.querySelector('.menu-usuarioLogueado-container');

    // Comprueba si el clic fue dentro del menú o sus descendientes
    if (menuElement && !menuElement.contains(targetElement)
    && menuCategorias && !menuCategorias.contains(targetElement)
    && menuRepuestos && !menuRepuestos.contains(targetElement)
    && menuAccesorios && !menuAccesorios.contains(targetElement)
        ) {
      this.menuVisible = false;
      this.menuCategoriasVisible = false;
      this.menuRepuestosVisible = false;
      this.menuAccesoriosVisible = false;
      // Necesitas decirle a Angular que detecte los cambios ya que esto no ocurre en la zona de Angular
      this.cdr.detectChanges();
    }

    // Comprueba si el clic fue dentro del menú o sus descendientes
    if (menuLogueado && !menuLogueado.contains(targetElement)) {
        this.menuUsuarioLogueado = false;
        this.cdr.detectChanges();
      }
  }

  menuVisible: boolean = false;
  menuCategoriasVisible: boolean = false;
  menuRepuestosVisible: boolean = false;
  menuAccesoriosVisible: boolean = false;
  menuUsuarioLogueado: boolean = false;


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
    console.log("Invocando getSalesPoints"); // Log para verificar la invocación del método
    this.conexionService.getSalesPoints().subscribe(data => {
        console.log("Datos recibidos de getSalesPoints:", data); // Log para inspeccionar los datos recibidos
        if (data && data.sales_points && data.sales_points.length > 0) { // Corrección aquí
            console.log("Dato correcto y contiene elementos."); // Log para confirmar la validez de los datos
            const provincias = data.sales_points; // Acceso correcto a sales_points
            this.provincias2 = provincias;
            console.log("Provincias extraídas:", provincias); // Log para ver las provincias

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
                focusConfirm: false,
                preConfirm: () => {
                    return [
                        (document.getElementById('swal-select1') as HTMLSelectElement).value,
                        (document.getElementById('swal-select2') as HTMLSelectElement).value
                    ];
                },
                confirmButtonText: 'Buscar',
                didOpen: () => {
                  const modal = document.querySelector('.swal2-popup');
                  // Verifica también si la URL termina con 'busqueda'
                  if (modal && window.location.href.endsWith('busqueda') && window.screen.width < 768) {
                      (modal as HTMLElement).style.borderRadius = '1rem';
                      (modal as HTMLElement).style.width = '300px';
                      (modal as HTMLElement).style.margin = '0 250px 500px 0';
                  }
                  this.handleModalOpen(provincias); // Log en handleModalOpen para verificar provincias
              }
            }).then((result) => {
                if (result.value) {
                  console.log(result.value);
                  const [provinciaId, ciudadId] = result.value;
                  if (provinciaId && ciudadId) {
                    let nombreCiudad = this.buscarCiudadPorIDs(parseInt(provinciaId), parseInt(ciudadId));
                    this.buscarPorUbicacion(this.terminoBusqueda, parseInt(provinciaId), parseInt(ciudadId));
                    console.log('Ciudad encontrada:', nombreCiudad);
                  }
                }
            });
        } else {
            console.log("Datos no contienen elementos o no están presentes."); // Log para errores en datos
        }
    }, error => {
        console.error("Error al obtener datos de getSalesPoints", error); // Log para capturar errores
    });
  }

  buscarCiudadPorIDs(provinciaId, ciudadId) {
    // Recorrer el array de provincias
    this.provincias2.forEach(provincia => {
        if (provincia.id === provinciaId) {
            // Recorrer el array de ciudades dentro de la provincia encontrada
            provincia.cities.forEach(ciudad => {
                if (ciudad.id === ciudadId) {
                    this.nombreCiudad = ciudad.name;
                }
            });
        }
    });
    return this.nombreCiudad;
}

  private buscarPorUbicacion(termino: string, provinciaId: number, ciudadId: number) {
    this.idProv = provinciaId;
    this.idCiudad = ciudadId;

    if(this.subcategoria != 0) {
      this.conexionService.getProductoBySearching(termino, undefined, this.subcategoria, provinciaId, ciudadId).subscribe(response => {
        this.productService.changeProductData(response.products);
        this.productService.changeSearchTerm(this.terminoBusqueda);
        this.route.navigate(['busqueda']);
    }, error => {
      Swal.fire({
        title: "Ups!",
        text: "No se encontraron productos con la búsqueda realizada",
        icon: "info"
      });
    });
    } else {
      this.conexionService.getProductoBySearching(termino, undefined, undefined, provinciaId, ciudadId).subscribe(response => {
        this.productService.changeProductData(response.products);
        this.productService.changeSearchTerm(this.terminoBusqueda);
        this.route.navigate(['busqueda']);
    }, error => {
      Swal.fire({
        title: "Ups!",
        text: "No se encontraron productos con la búsqueda realizada",
        icon: "info"
      });
    });
    }

}

  private handleModalOpen(provincias: any[]) {
    console.log("Configurando modal con provincias:", provincias); // Log para ver provincias en modal
    const screenWidth = window.innerWidth;
    const modal = document.querySelector('.swal2-popup');
    const selects = document.querySelectorAll('.swal2-input');

    if (modal) {
        (modal as HTMLElement).style.borderRadius = '1rem';
    }

    if (screenWidth < 768) {
        selects.forEach(select => {
            (select as HTMLElement).style.fontSize = '11px';
        });
    }

    const selectEstado = document.getElementById('swal-select1') as HTMLSelectElement;
    const selectCiudad = document.getElementById('swal-select2') as HTMLSelectElement;

    selectEstado.onchange = () => {
        console.log("Cambio en selectEstado con valor:", selectEstado.value); // Log para seguimiento de cambio
        const selectedId = parseInt(selectEstado.value, 10);
        const selectedProvincia = provincias.find(provincia => provincia.id === selectedId);
        console.log("Provincia seleccionada:", selectedProvincia); // Log para inspeccionar provincia seleccionada

        if (selectedProvincia) {
            selectCiudad.innerHTML = selectedProvincia.cities.map(ciudad => {
                let cityName = ciudad.name;
                return `<option value="${ciudad.id}">${cityName}</option>`;
            }).join('');
            selectCiudad.disabled = false;
        } else {
            selectCiudad.innerHTML = '<option value="">Elige una provincia primero</option>';
            selectCiudad.disabled = true;
        }
    };
  }




  abrirModalInicio() {
    Swal.fire({
      title: 'Inicio de Sesión',
      html: `
        <img width="50" src="../../../assets/images/icons/user.png" alt="imagen"><br>
        <input size="10" id="email" class="swal2-input mt-3" placeholder="Email">
        <input size="10" id="password" class="swal2-input mt-3" placeholder="Contraseña" type="password">
        <button id="login-btn" class="swal2-confirm swal2-styled mt-3" style="display: block; background-color: #28a745; margin: 0.5rem auto;">ENTRAR</button>
        <button id="register-btn" class="swal2-confirm swal2-styled mt-3" style="display: block; margin: 0.5rem auto;">REGISTRATE</button>
        <p class="mt-3" style="text-align: center;"><i>¿Olvidaste tu contraseña?<br> Te enviamos un email <a style="text-decoration: none; color: #333" href="link-recuperacion"><b>aquí</b></i></a></p>
        <p class="mt-3" style="text-align: center;"><a href="/validarcuenta">Necesito validar mi cuenta</a></p>
      `,
      showConfirmButton: false,
      position: 'center',
      didOpen: () => {
        document.getElementById('login-btn').addEventListener('click', () => {
          const email = (document.getElementById('email') as HTMLInputElement).value;
          const password = (document.getElementById('password') as HTMLInputElement).value;
          this.recaptchaService.executeRecaptcha('login').then(token => {
            this.authService.loginUsuario(email, password, token).subscribe({
              next: (response) => {
                Swal.fire('¡Bienvenido!', 'Inicio de sesión exitoso.', 'success');
                localStorage.setItem("tokenUser", response.token);
                this.notificationService.setUserData(response.user_data);
                this.ngOnInit();
                this.cdr.detectChanges();
                this.route.navigate(['']);
              },
              error: (error) => {
                Swal.fire('Error', 'Hubo un problema al iniciar sesión.', 'error');
                console.error('Error en el login', error);
              }
            });
          }).catch(error => {
            console.error('Recaptcha error:', error);
          });
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

    if(this.idProv != 0 && this.idCiudad != 0 && this.subcategoria != 0) {
      this.conexionService.getProductoBySearching(this.terminoBusqueda, undefined, this.subcategoria, this.idProv, this.idCiudad).subscribe(response => {
        this.productService.changeProductData(response.products);
        this.productService.changeSearchTerm(this.terminoBusqueda);  // Guardar el término de búsqueda
        this.route.navigate(['busqueda']);
      }, error => {
        Swal.fire({
          title: "Ups!",
          text: "No se encontraron productos con la búsqueda realizada",
          icon: "info"
        });
      });
    } else if (this.subcategoria != 0) {
      this.conexionService.getProductoBySearching(this.terminoBusqueda, undefined, this.subcategoria).subscribe(response => {
        this.productService.changeProductData(response.products);
        this.productService.changeSearchTerm(this.terminoBusqueda);  // Guardar el término de búsqueda
        this.menuVisible = false;
        this.menuCategoriasVisible = false;
        this.menuRepuestosVisible = false;
        this.menuAccesoriosVisible = false;
        this.menuUsuarioLogueado = false;
        this.route.navigate(['busqueda']);
      }, error => {
        Swal.fire({
          title: "Ups!",
          text: "No se encontraron productos con la búsqueda realizada",
          icon: "info"
        });
      });
    } else if (this.idProv != 0 && this.idCiudad != 0) {
      this.conexionService.getProductoBySearching(this.terminoBusqueda, undefined, undefined, this.idProv, this.idCiudad).subscribe(response => {
        this.productService.changeProductData(response.products);
        this.productService.changeSearchTerm(this.terminoBusqueda);  // Guardar el término de búsqueda
        this.route.navigate(['busqueda']);
      }, error => {
        Swal.fire({
          title: "Ups!",
          text: "No se encontraron productos con la búsqueda realizada",
          icon: "info"
        });
      });
    } else {
      this.conexionService.getProductoBySearching(this.terminoBusqueda).subscribe(response => {
        this.productService.changeProductData(response.products);
        this.productService.changeSearchTerm(this.terminoBusqueda);  // Guardar el término de búsqueda
        this.route.navigate(['busqueda']);
      }, error => {
        Swal.fire({
          title: "Ups!",
          text: "No se encontraron productos con la búsqueda realizada",
          icon: "info"
        });
      });
    }

  }

  buscarProductoPorSubcategoria(idSubCategoria: number, nameSubCategoria: string) {
    this.subcategoria = idSubCategoria;

    if(this.idProv != 0 && this.idCiudad != 0 && this.subcategoria != 0) {
      this.conexionService.getProductoBySearching(this.terminoBusqueda, undefined, this.subcategoria, this.idProv, this.idCiudad).subscribe(response => {
        this.productService.changeProductData(response.products);
        this.productService.changeSearchTerm(this.terminoBusqueda);  // Guardar el término de búsqueda
        this.menuVisible = false;
        this.menuCategoriasVisible = false;
        this.menuRepuestosVisible = false;
        this.menuAccesoriosVisible = false;
        this.menuUsuarioLogueado = false;
        this.route.navigate(['busqueda']);
      }, error => {
        Swal.fire({
          title: "Ups!",
          text: "No se encontraron productos con la búsqueda realizada",
          icon: "info"
        });
      });
    } else if (this.subcategoria != 0) {
      this.conexionService.getProductoBySearching(this.terminoBusqueda, undefined, this.subcategoria).subscribe(response => {
        this.productService.changeProductData(response.products);
        this.productService.changeSearchTerm(this.terminoBusqueda);  // Guardar el término de búsqueda
        this.menuVisible = false;
        this.menuCategoriasVisible = false;
        this.menuRepuestosVisible = false;
        this.menuAccesoriosVisible = false;
        this.menuUsuarioLogueado = false;
        this.route.navigate(['busqueda']);
      }, error => {
        Swal.fire({
          title: "Ups!",
          text: "No se encontraron productos con la búsqueda realizada",
          icon: "info"
        });
      });
    } else if (this.idProv != 0 && this.idCiudad != 0) {
      this.conexionService.getProductoBySearching(this.terminoBusqueda, undefined, undefined, this.idProv, this.idCiudad).subscribe(response => {
        this.productService.changeProductData(response.products);
        this.productService.changeSearchTerm(this.terminoBusqueda);  // Guardar el término de búsqueda
        this.menuVisible = false;
        this.menuCategoriasVisible = false;
        this.menuRepuestosVisible = false;
        this.menuAccesoriosVisible = false;
        this.menuUsuarioLogueado = false;
        this.route.navigate(['busqueda']);
      }, error => {
        Swal.fire({
          title: "Ups!",
          text: "No se encontraron productos con la búsqueda realizada",
          icon: "info"
        });
      });
    } else {
      this.conexionService.getProductoBySearching(this.terminoBusqueda).subscribe(response => {
        this.productService.changeProductData(response.products);
        this.productService.changeSearchTerm(this.terminoBusqueda);  // Guardar el término de búsqueda
        this.menuVisible = false;
        this.menuCategoriasVisible = false;
        this.menuRepuestosVisible = false;
        this.menuAccesoriosVisible = false;
        this.menuUsuarioLogueado = false;
        this.route.navigate(['busqueda']);
      }, error => {
        Swal.fire({
          title: "Ups!",
          text: "No se encontraron productos con la búsqueda realizada",
          icon: "info"
        });
      });
    }
  }


  buscarProductoPorOferta() {
    this.conexionService.getProductoBySearching(undefined, undefined, undefined, undefined, undefined, 'ofertas', 20).subscribe(response => {
      if (response.status && response.products.length > 0) {

        this.menuVisible = false;
        this.menuCategoriasVisible = false;
        this.menuRepuestosVisible = false;
        this.menuAccesoriosVisible = false;
        this.menuUsuarioLogueado = false;

        this.arrojarToast("Buscando por oferta");
        this.productService.changeProductData(response.products);
        this.route.navigate(['busqueda']);
      }
    }, error => {
      Swal.fire({
        title: "Ups!",
        text: "Hubo un error",
        icon: "error"
      });
    });
  }


  buscarProductoPorDestacado() {
    this.conexionService.getProductoBySearching(undefined, undefined, undefined, undefined, undefined, 'destacados', 20).subscribe(response => {
      if (response.status && response.products.length > 0) {

        this.menuVisible = false;
        this.menuCategoriasVisible = false;
        this.menuRepuestosVisible = false;
        this.menuAccesoriosVisible = false;
        this.menuUsuarioLogueado = false;

        this.arrojarToast("Buscando por 'Podría interesarte'");
        this.productService.changeProductData(response.products);
        this.route.navigate(['busqueda']);
      }
    }, error => {
      Swal.fire({
        title: "Ups!",
        text: "Hubo un error",
        icon: "error"
      });
    });
  }

  arrojarToast(mensaje: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: "center",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });

    Toast.fire({
      icon: "info",
      title: mensaje
    });
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
      '<input type="text" class="form-control sw-input" style="width: 35px; height: 55px; font-size: 18px; text-align: center; margin: 0 2px;" maxlength="1">'
    ).join('');

    Swal.fire({
      icon: 'info',
      title: 'Ingrese su email y código',
      html: `
        <input size="10" id="email-code" class="swal2-input mb-4" placeholder="Email">
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
        <input size="10" id="email-phone" class="swal2-input" placeholder="Email">
        <input size="10" id="codarea" class="swal2-input" placeholder="Cod Area">
        <input size="10" id="phone" class="swal2-input" placeholder="Número de celular">
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

  verElemento() {
    if(this.authService.sesionIniciada()){
      return true;
    } else {
      return false;
    }
  }

  cerrarSesion() {
    this.authService.deslogear();
    this.notificationService.updateCartCount(0);
    this.notificationService.updateFavCount(0);
    Swal.fire('Sesión cerrada',`Esperamos verte pronto!`, `info`);
    this.route.navigate(['']);
  }

  abrirContainer(event: MouseEvent) {
    event.stopPropagation();
    this.menuUsuarioLogueado = !this.menuUsuarioLogueado;
  }

  verPerfil() {
    this.menuVisible = false;
    this.menuCategoriasVisible = false;
    this.menuRepuestosVisible = false;
    this.menuAccesoriosVisible = false;
    this.menuUsuarioLogueado = false;
    this.route.navigate(['perfil']);
  }

  verHistorialOrdenes() {
    this.menuVisible = false;
    this.menuCategoriasVisible = false;
    this.menuRepuestosVisible = false;
    this.menuAccesoriosVisible = false;
    this.menuUsuarioLogueado = false;
    this.route.navigate(['orden/historial']);
  }

}

