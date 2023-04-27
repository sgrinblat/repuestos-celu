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
    this.posts$ = from(this.contentfulService.getBlogEntriesByCategoryAndOnlyThree("noticia"));
    this.randomNumber = Math.floor(Math.random() * 7) + 1;
    this.randomNumber1 = Math.floor(Math.random() * 2) + 1;
  }

  verEntrada(id: number) {
    this.route.navigate(['noticias', id]);
  }

  onButtonClick(buttonLabel: string) {
    this.gaService.event('click', 'Buttons', buttonLabel);
  }


}
