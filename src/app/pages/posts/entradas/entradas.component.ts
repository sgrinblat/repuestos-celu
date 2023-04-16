// import { Component, Input, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { Observable } from 'rxjs';
// import { DataWpService } from '../data-wp.service';

// @Component({
//   selector: 'app-entradas',
//   templateUrl: './entradas.component.html',
//   styleUrls: ['./entradas.component.css']
// })
// export class EntradasComponent implements OnInit {
//   p: number = 1;

//   constructor(private dataWp: DataWpService, private route: Router) { }
//   posts$: Observable<any[]>;

//   ngOnInit() {
//     this.posts$ = this.dataWp.getEntradasNoticias();
//   }

//   verEntrada(id: number) {
//     this.route.navigate(['noticias/entrada', id]);
//   }

// }

import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ContentfulService } from '../contentful.service';
import { from } from 'rxjs';


@Component({
  selector: 'app-entradas',
  templateUrl: './entradas.component.html',
  styleUrls: ['./entradas.component.css']
})
export class EntradasComponent implements OnInit {
  p: number = 1;

  constructor(private contentfulService: ContentfulService, private route: Router) { }
  posts$: Observable<any>;

  ngOnInit() {
    //this.posts$ = this.contentfulService.getAllEntries();
    this.posts$ = from(this.contentfulService.getBlogEntriesByCategory("noticia"));
  }

  verEntrada(id: number) {
    this.route.navigate(['noticias', id]);
  }

}
