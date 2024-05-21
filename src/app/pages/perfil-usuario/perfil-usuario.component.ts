import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { Usuario } from 'src/app/models/usuario';
import { ConexionService } from 'src/app/service/conexion.service';
import { NotificationService } from 'src/app/service/notification.service';
import { RecaptchaService } from 'src/app/service/recaptcha.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css']
})
export class PerfilUsuarioComponent implements OnInit {

  contactForm!: FormGroup;
  user: Usuario = new Usuario();
  public robot: boolean;
  public presionado: boolean;

  constructor(private conexionService: ConexionService, private recaptchaService: RecaptchaService,
    private recaptchaV3Service: ReCaptchaV3Service, private readonly fb: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef, private notificationService: NotificationService,
    private router: Router
    ) {
    this.contactForm = fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      identity_number: ['', [Validators.required, Validators.minLength(8)]],
      email: ['', [Validators.required, Validators.minLength(6), Validators.email]],
      code_area: ['', [Validators.required, Validators.minLength(2)]],
      cel_phone: ['', [Validators.required, Validators.minLength(5)]],
      street_address: ['', [Validators.required, Validators.minLength(3)]],
      number_address: ['', [Validators.required, Validators.minLength(1)]],
      floor_apartment: ['', [Validators.required, Validators.minLength(2)]],
      state_id: ['none', Validators.required],
      city_id: ['none', Validators.required],
    });
  }

  provincias: any[] = [];
  ciudades: any[] = [];
  provinciaSeleccionada: any;
  ciudadSeleccionada: any = "null";
  captchaResponse: any = "null";
  userData: any;

  ngOnInit() {
    this.conexionService.getStates().subscribe(
      data => {
        this.provincias = data.states;
        this.changeDetectorRef.detectChanges();
      },
      error => {
        console.error('Error: ', error);
      }
    );

    this.notificationService.userData$.subscribe(data => {
      this.userData = data;
    });

    this.conexionService.obtenerDataUsuario().subscribe(
      data => {
        console.log(data);
      },
      error => {
        console.error('Error: ', error);
      }
    );

    this.robot = true;
    this.presionado = false;

    this.contactForm.get('state_id').valueChanges.subscribe(value => {
      this.onProvinciaChange(value);
    });
  }

  onProvinciaChange(provinciaId: number) {
    if (provinciaId) {
      // Suponiendo que getCiudadesPorProvincia() es el método que obtiene las ciudades según la provincia
      this.conexionService.getCities(provinciaId).subscribe({
        next: (response) => {
          if (response && response.status && Array.isArray(response.cities)) {
            this.ciudades = response.cities; // Asegurándote de que es un array
            this.contactForm.get('city_id').setValue('none');; // Opcional: Resetear la selección de ciudad
          } else {
            this.ciudades = []; // En caso de que la respuesta no sea el formato esperado
          }
        },
        error: (error) => {
          console.error('Error al cargar las ciudades:', error);
          this.ciudades = []; // Limpiar las ciudades en caso de error
        }
      });
    } else {
      this.ciudades = []; // Si no hay una provincia válida seleccionada, limpiar las ciudades
      this.contactForm.get('city_id').setValue('none');
    }
  }

  cambiarDatos() {
    if (this.contactForm.valid) {
      const formData = this.contactForm.value;
      this.conexionService.cambiarDataUsuario(formData).subscribe(
        data => {
          console.log('Datos actualizados:', data);
          Swal.fire('Listo!', 'Datos actualizados!', 'success');
          this.router.navigate([""])
        },
        error => {
          console.error('Error al actualizar los datos:', error);
          Swal.fire('Error', 'Algo salió mal!', 'error');
        }
      );
    } else {
      // Manejar la validación del formulario si es necesario
      console.error('Formulario no válido:', this.contactForm.errors);
    }
  }

  cambiarPassword() {
    Swal.fire({
      title: 'Cambiar Contraseña',
      html: `
        <input type="password" id="password" class="swal2-input" placeholder="Nueva contraseña">
        <input type="password" id="repassword" class="swal2-input" placeholder="Confirmar nueva contraseña">
      `,
      focusConfirm: false,
      preConfirm: () => {
        const password = (Swal.getPopup()!.querySelector('#password') as HTMLInputElement).value;
        const repassword = (Swal.getPopup()!.querySelector('#repassword') as HTMLInputElement).value;

        if (!password || !repassword || password !== repassword) {
          Swal.showValidationMessage("Las contraseñas no coinciden o están vacías");
          return Promise.reject(null);
        }
        return { password, repassword };
      },
      showCancelButton: true,
      confirmButtonText: 'Cambiar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.conexionService.cambiarContraseña(result.value).subscribe(
          response => {
            Swal.fire('Éxito', 'La contraseña ha sido cambiada correctamente.', 'success');
          },
          error => {
            Swal.fire('Error', 'No se pudo cambiar la contraseña.', 'error');
          }
        );
      }
    }).catch(error => {
      console.error('Error en el proceso:', error);
    });
  }

}
