import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ContentfulService } from '../contentful.service';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { from } from 'rxjs';

@Component({
  selector: 'app-lista-entradas',
  templateUrl: './lista-entradas.component.html',
  styleUrls: ['./lista-entradas.component.css']
})
export class ListaEntradasComponent implements OnInit {
  id: string;
  blogPost$: Observable<any>;
  posts$: Observable<any[]>;

  constructor(private contentfulService: ContentfulService, private router: Router, private route: ActivatedRoute, @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit() {
    if(isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
    Loading.hourglass();

    this.route.params.subscribe(
      params => {
        Loading.remove(1000);
        const id = params['id'];
        this.blogPost$ = this.contentfulService.getEntryById(id);

      }
    )

    this.posts$ = from(this.contentfulService.getBlogEntriesByCategoryAndOnlyThree("noticia"));
  }

  verEntrada(id: string) {
    if(isPlatformBrowser(this.platformId)) {
      this.router.navigate(['noticias', id]);
      Loading.hourglass();
      window.scrollTo(0, 0);
      Loading.remove(500);
    }

  }
}


