import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ConexionService } from 'src/app/service/conexion.service';

import { ReCaptchaV3Service } from 'ng-recaptcha';
import { RecaptchaService } from 'src/app/service/recaptcha.service';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Loading } from 'notiflix';
import { Usuario } from 'src/app/models/usuario';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-usuario',
  templateUrl: './registro-usuario.component.html',
  styleUrls: ['./registro-usuario.component.css']
})
export class RegistroUsuarioComponent implements OnInit {

  contactForm!: FormGroup;
  user: Usuario = new Usuario();
  public robot: boolean;
  public presionado: boolean;

  constructor(private conexionService: ConexionService, private recaptchaService: RecaptchaService,  private recaptchaV3Service: ReCaptchaV3Service, private readonly fb: FormBuilder, private changeDetectorRef: ChangeDetectorRef) {
    this.contactForm = fb.group({
      formularioNombreUsuario: ['', [Validators.required, Validators.minLength(5)]],
      formularioDNIUsuario: ['', [Validators.required, Validators.minLength(8)]],
      formularioEmailUsuario: ['', [Validators.required, Validators.minLength(6), Validators.email]],
      formularioPasswordUsuario: ['', [Validators.required, Validators.minLength(6), PasswordStrengthValidator()]],
      formularioCodAreaUsuario: ['', [Validators.required, Validators.minLength(2)]],
      formularioNroTelUsuario: ['', [Validators.required, Validators.minLength(5)]],
      formularioCalleDirUsuario: ['', [Validators.required, Validators.minLength(3)]],
      formularioCalleNroUsuario: ['', [Validators.required, Validators.minLength(1)]],
      formularioPisoDeptoUsuario: ['', [Validators.required, Validators.minLength(2)]],
      provinciaSeleccionada: ['none', Validators.required],
      ciudadSeleccionada: ['none', Validators.required],
      policies_agree: [false, Validators.requiredTrue]
    });
  }

  provincias: any[] = [];
  ciudades: any[] = [];
  provinciaSeleccionada: any;
  ciudadSeleccionada: any = "null";
  captchaResponse: any = "null";

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


    this.robot = true;
    this.presionado = false;

    this.contactForm.get('provinciaSeleccionada').valueChanges.subscribe(value => {
      this.onProvinciaChange(value);
    });

  }


  getInfoRecaptcha() {
    this.robot = true;
    this.presionado = true;
    this.recaptchaV3Service.execute('')
      .subscribe((token) => {
          const auxiliar = this.recaptchaService.getTokenClientModule(token)
          auxiliar.subscribe( {
            complete: () => {
              this.presionado = false;
            },
            error: () => {
              this.presionado = false;
              this.robot = true;
              alert('Tenemos un problema, recarga la página página para solucionarlo o contacta con 1938web@gmail.com');
            },
            next: (resultado: Boolean) => {
              if (resultado === true) {
                this.presionado = false;
                this.robot = false;
              } else {
                alert('Error en el captcha. Eres un robot')
                this.presionado = false;
                this.robot = true;
              }
            }
          });
        }
      );
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


  registrarse() {
    Loading.hourglass();
    const formModel = this.contactForm.value;

    this.user = {
      name: formModel.formularioNombreUsuario,
      identity_number: formModel.formularioDNIUsuario,
      email: formModel.formularioEmailUsuario,
      password: formModel.formularioPasswordUsuario,
      code_area: formModel.formularioCodAreaUsuario,
      cel_phone: formModel.formularioNroTelUsuario,
      state: formModel.provinciaSeleccionada,
      city: formModel.ciudadSeleccionada,
      street_address: formModel.formularioCalleDirUsuario,
      number_address: formModel.formularioCalleNroUsuario,
      floor_apartment: formModel.formularioPisoDeptoUsuario,
      policies_agree: formModel.policies_agree
    };

    console.log(this.user);


    this.conexionService.registrarUsuario(this.user).subscribe({
      next: (response) => {
        Loading.remove(500);
        console.log('Registro exitoso', response);
        this.onRegistroExitoso(this.user.email)
      },
      error: (error) => {
        Loading.remove(500);
        console.error('Error en el registro', error);
        // Mostrar mensaje de error
      }
    });

  }


  onRegistroExitoso(email: string) {
    const inputs = Array.from({ length: 6 }, () =>
      '<input type="text" class="form-control sw-input" style="width: 45px; height: 55px; font-size: 24px; text-align: center; margin: 0 5px;" maxlength="1">'
    ).join('');

    Swal.fire({
      icon: 'info',
      title: 'Registro exitoso. Valida tu celular con el sms que te enviamos!',
      html: `<div style="display: flex; justify-content: center;">${inputs}</div>`,
      focusConfirm: false,
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
        this.conexionService.validarCodigo(email, parseInt(result.value)).subscribe({
          next: (response) => {
            Swal.fire('¡Validación exitosa!', 'Tu número ha sido validado.', 'success');
          },
          error: (error) => {
            Swal.fire('Error', 'Hubo un problema al validar el código.', 'error');
          }
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








}
export function PasswordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    let password = control.value;
    let regExp = /^(?=.*?[A-Z])(?=.*?[0-9]).{6,}$/;
    if (password && !regExp.test(password)) {
      return { 'passwordStrength': true };
    }
    return null;
  };
}
