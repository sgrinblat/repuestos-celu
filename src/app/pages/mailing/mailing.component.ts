import { Component, OnInit, Renderer2, ViewChild, ElementRef, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConexionService } from 'src/app/service/conexion.service';
import { Usuario } from 'src/app/usuario';

@Component({
  selector: 'app-mailing',
  templateUrl: './mailing.component.html',
  styleUrls: ['./mailing.component.css']
})
export class MailingComponent implements OnInit {
  p: number = 1;
  usuarios: Usuario[];

  constructor(private conexion: ConexionService, private activatedRoute: ActivatedRoute, private route: Router) {

  }

  ngOnInit() {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    this.conexion.getTodosLosUsers().subscribe((dato) => {
      let emails = new Set(); // Usamos un Set para almacenar los emails. Un Set solo permite valores únicos
      this.usuarios = dato.filter(usuario => {
        if (!emails.has(usuario.email)) {
          emails.add(usuario.email);
          return true; // Si el correo no estaba presente en el Set, se añade y se incluye el usuario
        }
        return false; // Si el correo ya estaba en el Set, se excluye el usuario
      });
    });
  }


}
