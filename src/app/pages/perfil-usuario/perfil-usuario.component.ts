import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
    private changeDetectorRef: ChangeDetectorRef, private notificationService: NotificationService
    ) {
    this.contactForm = fb.group({
      formularioNombreUsuario: ['', [Validators.required, Validators.minLength(5)]],
      formularioDNIUsuario: ['', [Validators.required, Validators.minLength(8)]],
      formularioEmailUsuario: ['', [Validators.required, Validators.minLength(6), Validators.email]],
      formularioCodAreaUsuario: ['', [Validators.required, Validators.minLength(2)]],
      formularioNroTelUsuario: ['', [Validators.required, Validators.minLength(5)]],
      formularioCalleDirUsuario: ['', [Validators.required, Validators.minLength(3)]],
      formularioCalleNroUsuario: ['', [Validators.required, Validators.minLength(1)]],
      formularioPisoDeptoUsuario: ['', [Validators.required, Validators.minLength(2)]],
      provinciaSeleccionada: ['none', Validators.required],
      ciudadSeleccionada: ['none', Validators.required],
      metodoDePago: ['none', Validators.required],
      policies_agree: [false, Validators.requiredTrue]
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


    this.robot = true;
    this.presionado = false;

    this.contactForm.get('provinciaSeleccionada').valueChanges.subscribe(value => {
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
            this.contactForm.get('ciudadSeleccionada').setValue('none');; // Opcional: Resetear la selección de ciudad
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
      this.contactForm.get('ciudadSeleccionada').setValue('none');
    }
  }
}
