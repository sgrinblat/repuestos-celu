import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ContentfulService } from '../posts/contentful.service';
import { from } from 'rxjs';
import { GoogleAnalyticsService } from 'ngx-google-analytics';



@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css']
})
export class MainpageComponent implements OnInit {

  constructor(private contentfulService: ContentfulService, private route: Router, @Inject(PLATFORM_ID) private platformId: Object, private gaService: GoogleAnalyticsService) { }
  posts$: Observable<any[]>;
  randomNumber: number;
  randomNumber1: number;

  ngOnInit() {

    if(isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }

    const width = window.innerWidth;

    if (width < 768) {
      // Función para dispositivos móviles
      this.posts$ = from(this.contentfulService.getBlogEntriesByCategoryAndOnlyOne("noticia"));
    } else {
      // Función para dispositivos no móviles
      this.posts$ = from(this.contentfulService.getBlogEntriesByCategoryAndOnlyThree("noticia"));
    }

    //this.posts$ = from(this.contentfulService.getBlogEntriesByCategoryAndOnlyThree("noticia"));
    this.randomNumber = Math.floor(Math.random() * 5) + 1;
  }

  verEntrada(id: number) {
    this.route.navigate(['noticias', id]);
  }

  onButtonClick(buttonLabel: string) {
    this.gaService.event('click', 'Buttons', buttonLabel);
  }


}
