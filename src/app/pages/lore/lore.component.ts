import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ContentfulService } from '../posts/contentful.service';
import { from } from 'rxjs';

@Component({
  selector: 'app-lore',
  templateUrl: './lore.component.html',
  styleUrls: ['./lore.component.css']
})
export class LoreComponent implements OnInit {
  p: number = 1;

  constructor(private contentfulService: ContentfulService, private route: Router, @Inject(PLATFORM_ID) private platformId: Object) { }
  posts$: Observable<any>;

  ngOnInit() {
    if(isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
    this.posts$ = from(this.contentfulService.getBlogEntriesByCategory("lore"));
  }

  verEntrada(id: string) {
    this.route.navigate(['lore/entrada', id]);
  }
}
