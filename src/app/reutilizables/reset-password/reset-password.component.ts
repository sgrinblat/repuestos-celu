import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConexionService } from 'src/app/service/conexion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent  {
  resetPasswordForm: FormGroup;
  token: string;

  constructor(private conexionService: ConexionService, private route: ActivatedRoute, private router: Router) {
    this.token = this.route.snapshot.queryParams['token'];

    this.resetPasswordForm = new FormGroup({
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required])
    }, this.passwordMatchValidator);
  }

  passwordMatchValidator(formGroup: FormGroup) {
    return formGroup.get('password').value === formGroup.get('confirmPassword').value ? null : { mismatch: true };
  }

  submit() {
    if (this.resetPasswordForm.valid) {
      const password = this.resetPasswordForm.get('password').value;
      this.conexionService.updatePassword(this.token, password).subscribe({
        next: () => {
          this.router.navigate(['']);
          Swal.fire('¡Éxito!', 'Tu contraseña ha sido restablecida.', 'success');
        },
        error: error => {
          Swal.fire('Error', 'No se pudo restablecer la contraseña.', 'error');
        }
      });
    }
  }
}
