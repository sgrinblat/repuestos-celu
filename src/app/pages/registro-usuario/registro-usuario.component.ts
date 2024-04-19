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
          this.ciudades = []; // Limpiar las ciudades en caso de error
        }
      });
    } else {
      this.ciudades = []; // Si no hay una provincia válida seleccionada, limpiar las ciudades
      this.contactForm.get('ciudadSeleccionada').setValue('none');
    }
  }

  // this.recaptchaService.executeRecaptcha('registro').then(token => {

  // }).catch(error => {
  //   console.error('Recaptcha error:', error);
  // });

  registrarse() {
    if (this.contactForm.valid) {
      this.recaptchaService.executeRecaptcha('registro').then(token => {
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
          policies_agree: formModel.policies_agree,
          recaptcha_token: token
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
            Swal.fire({
              icon: "error",
              title: "Algo salió mal",
              text: "¿Llenaste todos los campos?",
            });
          }
      });

      }).catch(error => {
        console.error('Recaptcha error:', error);
      });
    }

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
        let numero = parseInt(result.value);
        if (isNaN(numero)) {
          Swal.showValidationMessage("Por favor, introduzca números válidos en los campos de área y teléfono.");
          return;
        }

        this.recaptchaService.executeRecaptcha('login').then(token => {
          this.conexionService.validarCodigo(email, numero, token).subscribe({
            next: (response) => {
              Swal.fire('¡Validación exitosa!', 'Tu número ha sido validado.', 'success');
            },
            error: (error) => {
              Swal.fire('Error', 'Hubo un problema al validar el código.', 'error');
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
