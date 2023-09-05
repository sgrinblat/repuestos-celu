import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ContentfulService } from '../../posts/contentful.service';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, from } from 'rxjs';

@Component({
  selector: 'app-entradas-fechas-torneo',
  templateUrl: './entradas-fechas-torneo.component.html',
  styleUrls: ['./entradas-fechas-torneo.component.css']
})
export class EntradasFechasTorneoComponent implements OnInit {

  constructor(private contentfulService: ContentfulService, private route: Router, @Inject(PLATFORM_ID) private platformId: Object) { }
  posts$: Observable<any>;

  ngOnInit() {
    if(isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
    this.posts$ = from(this.contentfulService.getBlogEntriesByCategoryAndOnlyThree("calendario"));
    console.log(this.posts$);

  }

}
