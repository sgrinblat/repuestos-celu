import { Component, OnInit } from '@angular/core';
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

  constructor(private contentfulService: ContentfulService, private route: Router) { }
  posts$: Observable<any>;

  ngOnInit() {
    //this.posts$ = this.contentfulService.getAllEntries();
    this.posts$ = from(this.contentfulService.getBlogEntriesByCategory("lore"));
  }

  verEntrada(id: number) {
    this.route.navigate(['lore/entrada', id]);
  }
}
