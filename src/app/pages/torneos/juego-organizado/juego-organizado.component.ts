import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Notify } from 'notiflix';
import { Observable } from 'rxjs';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { ContentfulService } from '../../posts/contentful.service';
import { from } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ElementRef } from '@angular/core';

@Component({
  selector: 'app-juego-organizado',
  templateUrl: './juego-organizado.component.html',
  styleUrls: ['./juego-organizado.component.css']
})
export class JuegoOrganizadoComponent implements OnInit {
  id: string;
  blogPost$: Observable<any>;
  posts$: Observable<any[]>;
  rankingLiga = false;
  rankingApertura = false;
  banderaDecklist = false;
  banderaCalendario = true;

  constructor(
    private elementRef: ElementRef,
    private contentfulService: ContentfulService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  irDecklists() {
    if(this.rankingApertura == true) {
      this.rankingApertura = false;
    }
    if(this.rankingLiga == true) {
      this.rankingLiga = false;
    }

    if(this.banderaCalendario == true) {
      this.banderaCalendario = false;
    }

    if(this.banderaDecklist == false) {
      this.banderaDecklist = true;
    }
  }


  banderaRankingLiga() {
    if(this.rankingApertura == true) {
      this.rankingApertura = false;
    }
    if(this.rankingLiga == false) {
      this.rankingLiga = true;
    }

    if(this.banderaCalendario == true) {
      this.banderaCalendario = false;
    }

    if(this.banderaDecklist == true) {
      this.banderaDecklist = false;
    }
  }

  banderaRankingApertura() {
    if(this.rankingLiga == true) {
      this.rankingLiga = false;
    }
    if(this.rankingApertura == false) {
      this.rankingApertura = true;
    }

    if(this.banderaCalendario == true) {
      this.banderaCalendario = false;
    }

    if(this.banderaDecklist == true) {
      this.banderaDecklist = false;
    }
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }

    this.route.params.subscribe((params) => {
      const id = params['id'];
      this.blogPost$ = this.contentfulService.getEntryById(id).pipe(
        tap(() => {
          // Asegúrate de que este setTimeout está dentro del operador tap.
          //setTimeout(() => this.modifyImageStyles(), 0);
        })
      );
    });

    this.posts$ = from(
      this.contentfulService.getBlogEntriesByCategoryAndOnlyThree('lore')
    );
  }

  verEntrada(id: string) {
    if (isPlatformBrowser(this.platformId)) {
      this.router.navigate(['lore/entrada', id]);
      Loading.hourglass();
      window.scrollTo(0, 0);
      Loading.remove(500);
    }
  }

  irTutorial() {
    if (isPlatformBrowser(this.platformId)) {
      this.router.navigate(['/tutorial']);
      window.scrollTo(0, 0);
    }
  }


}
