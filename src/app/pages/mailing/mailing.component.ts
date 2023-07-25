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
      this.usuarios = dato;
    });
  }

}
