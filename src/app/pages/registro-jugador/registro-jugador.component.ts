import { Component, OnInit, Renderer2, ViewChild, ElementRef, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ConexionService } from 'src/app/service/conexion.service';
import Swal from 'sweetalert2';
import { Usuario } from '../../usuario';

@Component({
  selector: 'app-registro-jugador',
  templateUrl: './registro-jugador.component.html',
  styleUrls: ['./registro-jugador.component.css']
})
export class RegistroJugadorComponent implements OnInit {

  contactForm!: FormGroup;
  user: Usuario = new Usuario();

  constructor(private conexion: ConexionService, private readonly fb: FormBuilder, private activatedRoute: ActivatedRoute, private route: Router) {
    this.contactForm = fb.group({
      formularioUsernameUsuario: ['', [Validators.required, Validators.minLength(5)]],
      formularioPasswordUsuario: ['', [Validators.required, Validators.minLength(6)]],
      formularioEmailUsuario: ['', [Validators.required, Validators.minLength(6)]],
      formularioNombreUsuario: ['', [Validators.required, Validators.minLength(3)]],
      formularioApellidoUsuario: ['', [Validators.required, Validators.minLength(3)]],
    });

  }

  ngOnInit() {
  }

  registrarse() {
    this.user.username = this.contactForm.value.formularioUsernameUsuario;
    this.user.password = this.contactForm.value.formularioPasswordUsuario;
    this.user.email = this.contactForm.value.formularioEmailUsuario;
    this.user.nombre = this.contactForm.value.formularioNombreUsuario;
    this.user.apellido = this.contactForm.value.formularioApellidoUsuario;

    console.log(this.user);


    this.conexion.postUsuario(this.user).subscribe(
      (dato) => {
        Swal.fire('Registro exitoso',`Ya podes iniciar sesión!`, `success`);
        this.route.navigate(['/iniciarsesion']);
      },
      (error: Error) => console.log("Qué estás buscando, picaron? " + error.message)
    );


  }

}
