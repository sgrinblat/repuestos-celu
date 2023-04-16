import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ContentfulService } from '../posts/contentful.service';
import { from } from 'rxjs';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css']
})
export class MainpageComponent implements OnInit {

  constructor(private contentfulService: ContentfulService, private route: Router) { }
  posts$: Observable<any[]>;
  randomNumber: number;

  ngOnInit() {
    this.posts$ = from(this.contentfulService.getBlogEntriesByCategoryAndOnlyThree("noticia"));
    this.randomNumber = Math.floor(Math.random() * 3) + 1;
  }

  verEntrada(id: number) {
    this.route.navigate(['noticias', id]);
  }

}
