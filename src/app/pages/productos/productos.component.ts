import { Component, Inject, OnInit, PLATFORM_ID, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  @ViewChild('seccion') miSeccion: ElementRef;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router, private activatedRoute: ActivatedRoute) {}

  seleccionado: string;

  ngOnInit() {
    if(isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }

  mostrarSeccion(nombre: string) {
    Loading.hourglass();
    Loading.remove(300);
    setTimeout(() => {
      this.seleccionado = nombre;
    }, 300);

    this.miSeccion.nativeElement.scrollIntoView({ behavior: 'smooth' });

  }


}
