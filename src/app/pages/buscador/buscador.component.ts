import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';

import { ConexionService } from 'src/app/service/conexion.service';
import { Carta } from '../../carta';
import { Rareza } from 'src/app/rareza';
import { Expansion } from '../../expansion';
import { Tipo } from '../../tipo';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css']
})
export class BuscadorComponent implements OnInit {

  cartas!: Carta[];
  expansiones: Observable<Expansion[]>;
  rarezas: Observable<Rareza[]>;
  tipos: Observable<Tipo[]>;

  carta: Carta = new Carta();
  expansion: Expansion = new Expansion();
  rareza: Rareza = new Rareza();
  tipo: Tipo = new Tipo();


  p: number = 1;
  searchText: any;
  searchByExpa: any;
  searchByRare: any;
  searchByType: any;

  resultados: number;

  constructor(private conexion: ConexionService, private activatedRoute: ActivatedRoute, private route: Router, @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    this.obtenerCartas();
    this.expansiones = this.conexion.getTodasLasExpas();
    this.rarezas = this.conexion.getTodasLasRarezas();
    this.tipos = this.conexion.getTodasLosTipos();
  }

  obtenerCartas() {
    if(isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }

    this.conexion.getTodasLasCartasOrdenadas().subscribe((dato) => {
      this.cartas = dato;
    });
  }

  buscarPorExpansion(e, id: number) {
    if(e.target.checked) {
      this.buscarExpansion(id);
      this.resultados = document.querySelectorAll('.idCartaBuscada').length;
    } else {
      this.searchByExpa = "";
    }
  }

  buscarPorRareza(e, id: number) {
    if(e.target.checked) {
      this.buscarRareza(id);
      this.resultados = document.querySelectorAll('.idCartaBuscada').length;
    } else {
      this.searchByRare = "";
    }
  }

  buscarPorTipo(e, id: number) {
    if(e.target.checked) {
      this.buscarTipo(id);
    } else {
      this.searchByType = "";
    }
  }

  buscarExpansion(id: number) {
    this.conexion.getCartaByExpansion(id).subscribe((dato) => {
      this.searchByExpa = dato[0].expansion.nombreExpansion;
    }, (error) => console.log("Qué estás buscando, picaron?"));
  }

  buscarRareza(id: number) {
    this.conexion.getCartaByRareza(id).subscribe((dato) => {
      this.searchByRare = dato[0].rareza.nombreRareza;
    }, (error) => console.log("Qué estás buscando, picaron?"));
  }

  buscarTipo(id: number) {
    this.conexion.getCartaByTipo(id).subscribe((dato) => {
      this.searchByType = dato[0].tipo.nombreTipo;
    }, (error) => console.log("Qué estás buscando, picaron?"));
  }

}





