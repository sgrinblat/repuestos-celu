import { Component, OnInit } from '@angular/core';
import { ConexionService } from 'src/app/service/conexion.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-misordenes',
  templateUrl: './misordenes.component.html',
  styleUrls: ['./misordenes.component.css']
})
export class MisordenesComponent implements OnInit {
  ordenes: any[] = [];
  orderDetails: any;

  constructor(private conexionService: ConexionService) { }

  ngOnInit() {
    this.conexionService.obtenerOrdenes().subscribe({
      next: (response) => {
        if (response.status) {
          this.ordenes = response.orders;
          console.log(this.ordenes);

        }
      },
      error: (error) => {
        console.error('Error al obtener las órdenes:', error);
      }
    });
  }


  cargarDetallesOrden(id: number): void {
    this.conexionService.obtenerDetallesOrden(id).subscribe({
      next: (response) => {
        if (response.status) {
          this.orderDetails = response.order;
          console.log(this.orderDetails);
          if (this.orderDetails.bill_file) {
            this.abrirPDF(this.orderDetails.bill_file);
          }
        }
      },
      error: (error) => {
        console.error('Error al obtener detalles de la orden:', error);
      }
    });
  }

  abrirPDF(url: string): void {
    window.open(url, '_blank');
  }


  abrirModalSubirComprobante(orderId: number, orderDate: string): void {
    const normalizedOrderDate = this.normalizeDate(orderDate);

    Swal.fire({
      title: 'Subir Comprobante de Pago',
      html: `
        <input id="swal-input-amount" class="swal2-input" placeholder="Monto pagado" type="number">
        <input id="swal-input-date" class="swal2-input" placeholder="Fecha de pago" type="date" max="${this.formatDate(new Date())}">
        <input id="swal-input-file" class="swal2-input" type="file" accept=".jpg, .jpeg, .png, .pdf">
      `,
      focusConfirm: false,
      preConfirm: () => {
        const amount = (Swal.getPopup()!.querySelector('#swal-input-amount') as HTMLInputElement).value;
        const date_paid = (Swal.getPopup()!.querySelector('#swal-input-date') as HTMLInputElement).value;
        const fileInput = (Swal.getPopup()!.querySelector('#swal-input-file') as HTMLInputElement).files![0];

        if (!fileInput || !amount || !date_paid) {
          Swal.showValidationMessage("Todos los campos son obligatorios");
          return Promise.reject(null);
        }

        return this.validarYConvertirArchivo(fileInput, date_paid, normalizedOrderDate)
          .then(base64 => {
            if (base64) {
              return { payment_file: base64, amount, date_paid };
            }
            return Promise.reject(null);
          });
      },
      showCancelButton: true,
      confirmButtonText: 'Subir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.subirComprobante(orderId, result.value);
      }
    }).catch(error => {
      console.error('Error en el proceso de subida:', error);
    });
  }



  validarYConvertirArchivo(file: File, date_paid: string, orderDate: string): Promise<string|null> {
    console.log(`Archivo: ${file.type}, Fecha de pago: ${date_paid}, Fecha de orden: ${orderDate}`);

    return new Promise((resolve, reject) => {
        const validFormats = ['image/jpeg', 'image/png', 'application/pdf'];
        if (!validFormats.includes(file.type)) {
            console.log("Formato de archivo no válido");
            reject("Formato no válido");
            return;
        }

        const normalizedOrderDate = this.normalizeDate(orderDate);
        const normalizedDatePaid = this.normalizeDate(date_paid);
        const todayStr = this.formatDate(new Date());
        console.log(`Fechas para comparación - Hoy: ${todayStr}, Fecha de pago: ${normalizedDatePaid}, Fecha de orden: ${normalizedOrderDate}`);

        if (normalizedDatePaid > todayStr || normalizedDatePaid < normalizedOrderDate) {
            Swal.fire('Error', `La fecha ingresada es anterior a la de la generación de la orden: ${normalizedOrderDate}`, 'error');
            reject("Fecha no válida");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const base64String = reader.result as string;
            console.log("Archivo leído correctamente");
            console.log("Muestra de base64:", base64String.substring(0, 30)); // Muestra los primeros 30 caracteres del string base64
            resolve(base64String);
        };
        reader.onerror = error => {
            console.error("Error al leer el archivo", error);
            reject(error);
        };
        reader.readAsDataURL(file);
    });
}


  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;  // getMonth() devuelve un índice basado en cero, por lo que sumamos uno.
    const day = date.getDate();
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    console.log(`formatDate: ${formattedDate}`);
    return formattedDate;
  }

  normalizeDate(dateStr: string): string {
    const date = new Date(dateStr);
    const normalizedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    console.log(`normalizeDate: input=${dateStr}, output=${normalizedDate}`);
    return normalizedDate;
  }


  subirComprobante(orderId: number, data: { payment_file: string, amount: string, date_paid: string }): void {
    this.conexionService.actualizarOrden(orderId, data).subscribe({
      next: (response) => {
        console.log('Comprobante subido exitosamente:', response);
        Swal.fire('¡Éxito!', 'Comprobante subido correctamente.', 'success');
      },
      error: (error) => {
        console.error('Error al subir el comprobante:', error);
        Swal.fire('Error', 'Error al subir el comprobante.', 'error');
      }
    });
  }


}





