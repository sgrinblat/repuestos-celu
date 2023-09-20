import {
  Component,
  OnInit,
  Renderer2,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ConexionService } from 'src/app/service/conexion.service';
import Swal from 'sweetalert2';
import { Usuario } from '../../usuario';

@Component({
  selector: 'app-login-jugador',
  templateUrl: './login-jugador.component.html',
  styleUrls: ['./login-jugador.component.css'],
})
export class LoginJugadorComponent implements OnInit {
  contactForm!: FormGroup;
  user: Usuario = new Usuario();

  constructor(
    private conexion: ConexionService,
    private readonly fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private route: Router
  ) {
    this.contactForm = fb.group({
      formularioNombreUsuario: [
        '',
        [Validators.required, Validators.minLength(3)],
      ],
      formularioPasswordUsuario: [
        '',
        [Validators.required, Validators.minLength(3)],
      ],
    });
  }

  ngOnInit() {}

  resetPage(): void {
    // Navega primero a una ruta ficticia
    this.route.navigateByUrl('/reset', { skipLocationChange: true }).then(() => {
        // Navega de nuevo a tu ruta actual
        this.route.navigate([""]);
    });
}

  onSubmit() {
    this.user.username = this.contactForm.value.formularioNombreUsuario;
    this.user.password = this.contactForm.value.formularioPasswordUsuario;

    this.conexion.generateToken(this.user).subscribe(
      (dato: any) => {
        this.conexion.iniciarSesion(dato.token);
        this.conexion.getCurrentUser().subscribe((userDetails: any) => {
          if (userDetails.authorities[0].authority == 'JUGADOR') {
            this.conexion.getUsuarioActual().subscribe(
              (user: any) => {
                if (user.emailVerified) {
                  this.conexion.setUser(userDetails);
                  localStorage.setItem('location', '0');
                  Swal.fire(
                    'Login exitoso',
                    `Bienvenido ${userDetails.username} 😎`,
                    `success`
                  );

                  this.route.navigate(['']);
                  this.conexion.loginStatus.next(true);

                } else {
                  Swal.fire(
                    'Login fallido',
                    `Por favor verifica tu correo electrónico primero.`,
                    'error'
                  );
                }
              },
              (error) => {
                Swal.fire('Login fallido', `Quien te conoce papá?`, `error`);
                this.conexion.loginStatus.next(false);
              }
            );
          } else {
            Swal.fire('Login fallido', `Quien te conoce papá?`, `error`);
            this.conexion.loginStatus.next(false);
          }
        });
      },
      (error) => {
        Swal.fire('Login fallido', `Quien te conoce papá?`, `error`);
        this.conexion.loginStatus.next(false);
      }
    );
  }


  recuperarPass() {

    Swal.fire({
      title: 'Ingresa el email con el que registraste tu cuenta)',
      input: 'text',
      background: '#2e3031',
      color: '#fff',
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(result.value);

        this.conexion.requestPasswordReset(result.value).subscribe(
          response => {
            Swal.fire({
              icon: 'success',
              title: 'Email enviado!',
              text: 'Revisá tu mail para restaurar tu contraseña',
              background: '#2e3031',
              color: '#fff',
            });
          },
          error => {
            Swal.fire({
              icon: 'error',
              title: 'El mail no existe',
              text: 'Si sigues teniendo problemas, ponte en contacto con nosotros!',
              background: '#2e3031',
              color: '#fff',
            });
          }
        );
      }
    });

  }

}
