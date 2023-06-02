import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConexionService } from 'src/app/service/conexion.service';

@Component({
  selector: 'app-VerifyEmail',
  templateUrl: './VerifyEmailComponent.component.html',
  styleUrls: ['./VerifyEmailComponent.component.css']
})
export class VerifyEmailComponent implements OnInit {
  message: string;

  constructor(private route: ActivatedRoute, private router: Router, private userService: ConexionService) { }

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.userService.verifyEmail(token).subscribe(response => {
        this.message = response;
      });
    } else {
      this.message = 'No se proporcionó ningún token de verificación';
    }

    this.router.navigate(['/iniciarsesion']);

  }


}
