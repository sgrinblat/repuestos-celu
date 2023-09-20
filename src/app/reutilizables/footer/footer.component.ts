import { Component, OnInit } from '@angular/core';
import { ConexionService } from 'src/app/service/conexion.service';
import { Usuario } from 'src/app/usuario';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(private conexion: ConexionService) { }

  ngOnInit() {
  }

  verElemento() {
    if(this.conexion.sesionIniciadaJugador()){
      return true;
    } else {
      return false;
    }
  }




}
