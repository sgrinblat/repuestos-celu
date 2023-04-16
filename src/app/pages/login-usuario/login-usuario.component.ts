import { Component, OnInit, Renderer2, ViewChild, ElementRef, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ConexionService } from 'src/app/service/conexion.service';
import Swal from 'sweetalert2';
import { Usuario } from '../../usuario';

@Component({
  selector: 'app-login-usuario',
  templateUrl: './login-usuario.component.html',
  styleUrls: ['./login-usuario.component.css']
})

export class LoginUsuarioComponent implements OnInit {

  contactForm!: FormGroup;
  user: Usuario = new Usuario();

  constructor(private conexion: ConexionService, private readonly fb: FormBuilder, private activatedRoute: ActivatedRoute, private route: Router) {
    this.contactForm = fb.group({
      formularioNombreUsuario: ['', [Validators.required, Validators.minLength(3)]],
      formularioPasswordUsuario: ['', [Validators.required, Validators.minLength(3)]],
    });

  }

  ngOnInit() {
  }

  onSubmit() {
    this.user.username = this.contactForm.value.formularioNombreUsuario;
    this.user.password = this.contactForm.value.formularioPasswordUsuario;

    this.conexion.generateToken(this.user).subscribe(
      (dato:any) => {
        this.conexion.iniciarSesion(dato.token);
        this.conexion.getCurrentUser().subscribe((user:any) => {
          this.conexion.setUser(user);
          Swal.fire('Login exitoso',`Bienvenido papu 😎`, `success`);
          this.route.navigate(['v1/upload/cartas']);
          this.conexion.loginStatus.next(true);
        })
      },
      (error) => console.log(error)
    );
  }

}
