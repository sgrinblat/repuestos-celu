import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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

  constructor(private contentfulService: ContentfulService, private route: Router, @Inject(PLATFORM_ID) private platformId: Object) { }
  posts$: Observable<any>;

  ngOnInit() {
    if(isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
    this.posts$ = from(this.contentfulService.getBlogEntriesByCategory("noticia"));
  }

  verEntrada(id: number) {
    this.route.navigate(['noticias', id]);
  }

}
