import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ContentfulService } from '../../posts/contentful.service';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, from } from 'rxjs';
@Component({
  selector: 'app-entradas-decklists-jugadores',
  templateUrl: './entradas-decklists-jugadores.component.html',
  styleUrls: ['./entradas-decklists-jugadores.component.css']
})
export class EntradasDecklistsJugadoresComponent implements OnInit {

  constructor(private contentfulService: ContentfulService, private route: Router, @Inject(PLATFORM_ID) private platformId: Object) { }
  posts$: Observable<any>;

  ngOnInit() {
    if(isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
    this.posts$ = from(this.contentfulService.getBlogEntriesByCategory("decklists"));
    console.log(this.posts$);

  }

  verEntrada(id: number) {
    this.route.navigate(['noticias', id]);
  }

}
