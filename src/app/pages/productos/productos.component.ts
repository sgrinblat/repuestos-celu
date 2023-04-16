import { Component, OnInit } from '@angular/core';
import { Loading } from 'notiflix/build/notiflix-loading-aio';


@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  images;
    responsiveOptions;

  constructor() {}

  seleccionado: string;

  ngOnInit() {}

  mostrarFundamentos() {
    Loading.hourglass();
    Loading.remove(600);
    setTimeout(() => {
      this.seleccionado = "Fundamentos";
    }, 600);
  }

  mostrarExpansionA() {
    Loading.hourglass();
    Loading.remove(600);
    setTimeout(() => {
      this.seleccionado = "ExpansionA";
    }, 600);
  }


}
