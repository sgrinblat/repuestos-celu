import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { ElementRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ContentfulService } from '../contentful.service';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { from } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-lista-entradas',
  templateUrl: './lista-entradas.component.html',
  styleUrls: ['./lista-entradas.component.css'],
})
export class ListaEntradasComponent implements OnInit {
  id: string;
  blogPost$: Observable<any>;
  posts$: Observable<any[]>;

  constructor(
    private elementRef: ElementRef,
    private contentfulService: ContentfulService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
    Loading.hourglass();

    this.route.params.subscribe((params) => {
      Loading.remove(1000);
      const id = params['id'];
      this.blogPost$ = this.contentfulService.getEntryById(id).pipe(
        tap(() => {
          // Asegúrate de que este setTimeout está dentro del operador tap.
          setTimeout(() => this.modifyImageStyles(), 0);
        })
      );
    });

    this.posts$ = from(
      this.contentfulService.getBlogEntriesByCategoryAndOnlyThree('noticia')
    );


  }

  modifyImageStyles() {
    const images = this.elementRef.nativeElement.querySelectorAll('img');
    for (let i = 1; i < images.length; i++) {
      images[i].style.height = 'auto';
      images[i].style.width = '100%';
      images[i].style.maxWidth = '650px';
      images[i].style.margin = 'auto';
      images[i].style.display = 'block';
      images[i].style.marginTop = '30px';
      images[i].style.marginBottom = '90px';
    }
  }

  verEntrada(id: string) {
    if (isPlatformBrowser(this.platformId)) {
      this.router.navigate(['noticias', id]);
      Loading.hourglass();
      window.scrollTo(0, 0);
      Loading.remove(500);
    }
  }
}
