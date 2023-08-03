import { Component, OnInit } from '@angular/core';
import { GoogleAnalyticsService } from 'ngx-google-analytics';

@Component({
  selector: 'app-fundamentos',
  templateUrl: './fundamentos.component.html',
  styleUrls: ['./fundamentos.component.css']
})
export class FundamentosComponent implements OnInit {

  constructor(private gaService: GoogleAnalyticsService) { }

  ngOnInit() {
  }

  onButtonClick(buttonLabel: string) {
    this.gaService.event('click', 'Buttons', buttonLabel);
  }
}
