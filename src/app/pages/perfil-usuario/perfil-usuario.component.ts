import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/service/notification.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css']
})
export class PerfilUsuarioComponent implements OnInit {
  userData: any;

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.notificationService.userData$.subscribe(data => {
      this.userData = data;
    });
  }

  updateUserData() {
    this.notificationService.updateUserData(this.userData);
    Swal.fire('Actualizado', 'Tus datos han sido actualizados.', 'success');
  }
}
