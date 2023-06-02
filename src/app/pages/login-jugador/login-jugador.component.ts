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
}
