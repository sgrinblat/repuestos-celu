import { Component } from '@angular/core';
import * as AOS from 'aos';
import { NotificationService } from './service/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    AOS.init();
    window.addEventListener('load', AOS.refresh);
    this.notificationService.loadUserData();
  }
}


