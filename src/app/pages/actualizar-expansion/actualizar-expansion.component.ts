import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import Swal from 'sweetalert2';

import { Expansion } from '../../expansion';
import { ConexionService } from '../../service/conexion.service';

@Component({
  selector: 'app-actualizar-expansion',
  templateUrl: './actualizar-expansion.component.html',
  styleUrls: ['./actualizar-expansion.component.css']
})
export class ActualizarExpansionComponent implements OnInit {

  id: number;
  contactForm!: FormGroup;

  expansiones: Expansion[];
  expansion: Expansion = new Expansion();

  esverdad : boolean = false;

  @Input()
  nombreInput: string;

  @Output()
  nombreInputChange = new EventEmitter<string>();

  constructor(private conexion: ConexionService, private router: Router, private route: ActivatedRoute, private readonly fb: FormBuilder) {
    this.contactForm = fb.group({
      formularioExpansionNombre: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.conexion.getExpaById(this.id).subscribe(dato =>{
      this.expansion = dato;
      this.expansion.nombreExpansion = dato.nombreExpansion;

      console.log(dato);

    }, error => console.log(error), () => {
        this.esverdad = true;
        this.expansion.nombreExpansion = this.expansion.nombreExpansion;
      }
    );
  }

  onSubmit(){
    this.actualizar();
    this.regresarListaExpansiones();
  }

  actualizar() {
    this.expansion.nombreExpansion = this.contactForm.value.formularioExpansionNombre;
    this.expansion.nombreExpansion = this.expansion.nombreExpansion.toUpperCase();

    const fecha = new Date();
    console.log(fecha);
    this.expansion.fechaLanzamiento = fecha;
    //this.expansion.fechaLanzamiento = `${fecha.getDate()}-${fecha.getMonth}-${fecha.getFullYear}`;

    this.conexion.putExpansion(this.id, this.expansion).subscribe((dato) => {
      console.log(dato);
      Swal.fire('Expansión actualizada',`La expansión ${this.expansion.nombreExpansion} ha sido actualizada con exito`, `success`);
    }, error => {
      console.log(error);
      Swal.fire('La expansion no pudo ser actualizada', `error`);
    });
  }

  regresarListaExpansiones() {
    this.router.navigate(['/v1/upload/expas']);
  }

}
