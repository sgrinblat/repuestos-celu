// import { Component, OnInit } from '@angular/core';
// import { DataWpService } from '../data-wp.service';
// import { Observable } from 'rxjs';
// import { ActivatedRoute, Router } from '@angular/router';
// import { Loading } from 'notiflix/build/notiflix-loading-aio';

// @Component({
//   selector: 'app-lista-entradas',
//   templateUrl: './lista-entradas.component.html',
//   styleUrls: ['./lista-entradas.component.css'],
//   providers: [DataWpService]
// })
// export class ListaEntradasComponent implements OnInit {
//   id: number;
//   entrada: any;

//   constructor(private dataWp: DataWpService, private router: Router, private route: ActivatedRoute) { }

//   ngOnInit() {
//     this.id = this.route.snapshot.params['id'];

//     Loading.hourglass();
//     this.dataWp.getEntradaPorId(this.id).subscribe(dato =>{
//       Loading.remove(1000);
//       this.entrada = dato;
//     }, error => console.log("Qué estás buscando, picaron?"), () => {
//       }
//     );

//   }
// }

import { Component, OnInit } from '@angular/core';
import { ContentfulService } from '../contentful.service';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

@Component({
  selector: 'app-lista-entradas',
  templateUrl: './lista-entradas.component.html',
  styleUrls: ['./lista-entradas.component.css']
})
export class ListaEntradasComponent implements OnInit {
  id: string;
  blogPost$: Observable<any>;

  constructor(private contentfulService: ContentfulService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {

    Loading.hourglass();

    this.route.params.subscribe(
      params => {
        Loading.remove(1000);
        const id = params['id'];
        this.blogPost$ = this.contentfulService.getEntryById(id);

      }
    )

  }
}


