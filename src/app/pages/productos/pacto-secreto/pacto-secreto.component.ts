import { Component, OnInit } from '@angular/core';
import { GoogleAnalyticsService } from 'ngx-google-analytics';

@Component({
  selector: 'app-pacto-secreto',
  templateUrl: './pacto-secreto.component.html',
  styleUrls: ['./pacto-secreto.component.css']
})
export class PactoSecretoComponent implements OnInit {

  constructor(private gaService: GoogleAnalyticsService) { }

  ngOnInit() {
  }

  onButtonClick(buttonLabel: string) {
    this.gaService.event('click', 'Buttons', buttonLabel);
  }
}
