import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConexionService } from 'src/app/service/conexion.service';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';

import Swal from 'sweetalert2';
import { Usuario } from 'src/app/usuario';

@Component({
  selector: 'app-resetPassword',
  templateUrl: './resetPassword.component.html',
  styleUrls: ['./resetPassword.component.css']
})
export class ResetPasswordComponent {
  token = '';
  contactForm!: FormGroup;
  user: Usuario = new Usuario();

  constructor(private conexion: ConexionService, private route: ActivatedRoute, private readonly fb: FormBuilder) {
    this.route.params.subscribe(params => {
      this.token = params['token'];
      console.log(this.token);
    });

    this.contactForm = fb.group({
      formularioUsernameUsuario: ['', [Validators.required, Validators.minLength(5)]],
      formularioPasswordUsuario: ['', [Validators.required, Validators.minLength(6), PasswordStrengthValidator()]],
    });
  }

  onSubmit() {
    this.user.username = this.contactForm.value.formularioUsernameUsuario;
    this.user.password = this.contactForm.value.formularioPasswordUsuario;

    this.conexion.resetPassword(this.token, this.user.username, this.user.password).subscribe(
      response => {
        Swal.fire({
          icon: 'success',
          title: 'Contraseña actualizada',
          text: 'Ya puedes intentar logearte!',
          background: '#2e3031',
          color: '#fff',
        });
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Algo salió mal',
          text: 'Si sigues teniendo problemas, ponte en contacto con nosotros!',
          background: '#2e3031',
          color: '#fff',
        });
      }
    );
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
