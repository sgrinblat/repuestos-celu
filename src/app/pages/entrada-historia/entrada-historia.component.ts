import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Notify } from 'notiflix';
import { Observable } from 'rxjs';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { ContentfulService } from '../posts/contentful.service';

@Component({
  selector: 'app-entrada-historia',
  templateUrl: './entrada-historia.component.html',
  styleUrls: ['./entrada-historia.component.css']
})
export class EntradaHistoriaComponent implements OnInit {
  id: string;
  blogPost$: Observable<any>;

  constructor(private contentfulService: ContentfulService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {

    Loading.hourglass();

    this.route.params.subscribe(
      params => {
        Loading.remove(1000);
        const id = params['id'];
        this.blogPost$ = this.contentfulService.getEntryById(id);

      }
    )

  }
}
