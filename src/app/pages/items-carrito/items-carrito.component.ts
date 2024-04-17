import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-items-carrito',
  templateUrl: './items-carrito.component.html',
  styleUrls: ['./items-carrito.component.css']
})
export class ItemsCarritoComponent implements OnInit {

  constructor( private route: Router) { }

  ngOnInit() {
  }

  finalizarOrden() {
    this.route.navigate(["orden/finalizar"])
  }

}
