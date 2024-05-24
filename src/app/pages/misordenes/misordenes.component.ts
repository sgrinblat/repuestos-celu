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
    this.recuperarOrdenes();
  }

  recuperarOrdenes() {
    this.conexionService.obtenerOrdenes().subscribe({
      next: (response) => {
        if (response.status) {
          this.ordenes = response.orders;
        }
      },
      error: (error) => {
        Swal.fire('Error', `No se pudo obtener tus órdenes realizadas`, 'error');
      }
    });
  }


  cargarDetallesOrden(id: number): void {
    this.conexionService.obtenerDetallesOrden(id).subscribe({
      next: (response) => {
        if (response.status) {
          this.orderDetails = response.order;
          if (this.orderDetails.bill_file) {
            this.abrirPDF(this.orderDetails.bill_file);
          }
        }
      },
      error: (error) => {
        Swal.fire('Error', `No se pudo obtener detalles de la orden`, 'error');
      }
    });
  }

  abrirPDF(url: string): void {
    window.open(url, '_blank');
  }

  abrirModalSubirComprobante(orden, ordenId, orderDate: string): void {
    const normalizedOrderDate = this.normalizeDate(orderDate);
    const htmlContent = this.createPaymentsListHtml(orden);
    Swal.fire({
      title: 'Subir Comprobante de Pago',
      html: `
        <style>
          @media (max-width: 768px) {
            .swal2-input.swal-input-amount { width: 80%; }
          }
        </style>
        <input id="swal-input-amount" class="swal2-input swal-input-amount" placeholder="Monto pagado" type="number">
        <button id="custom-file-button" class="swal2-input" onclick="document.getElementById('swal-input-file').click()">Seleccionar archivo</button>
        <input id="swal-input-file" type="file" accept=".jpg, .jpeg, .png, .pdf" style="display:none;">
        ${htmlContent}`,
      focusConfirm: false,
      preConfirm: () => {
        const amount = (Swal.getPopup()!.querySelector('#swal-input-amount') as HTMLInputElement).value;
        const fileInput = (Swal.getPopup()!.querySelector('#swal-input-file') as HTMLInputElement).files![0];
        const date_paid = this.formatDate(new Date()); // Usamos la fecha y hora actual

        if (!fileInput || !amount) {
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
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.subirComprobante(ordenId, result.value);
      }
    }).catch(error => {

    });
  }





  createPaymentsListHtml(order: any): string {
    if (order.payments_files.length > 0) {
      let paymentsHtml = '<h4>Comprobantes Subidos:</h4><ul>';
      order.payments_files.forEach(file => {
        paymentsHtml += `<li><a href="${file.payment_file}" target="_blank">Ver comprob. (${new Date(file.created_at).toLocaleDateString()} ${new Date(file.created_at).toLocaleTimeString()})</a></li>`;
      });
      paymentsHtml += '</ul>';
      return paymentsHtml;
    }
    return '';
  }


  validarYConvertirArchivo(file: File, date_paid: string, orderDate: string): Promise<string|null> {
    return new Promise((resolve, reject) => {
        const validFormats = ['image/jpeg', 'image/png', 'application/pdf'];
        if (!validFormats.includes(file.type)) {
          Swal.fire('Error', `No es un tipo de archivo admitido (jpg, png, pdf)`, 'error');
            reject("Formato no válido");
            return;
        }

        const normalizedOrderDate = this.normalizeDate(orderDate);
        const normalizedDatePaid = this.normalizeDate(date_paid);
        const todayStr = this.formatDate(new Date());

        if (normalizedDatePaid > todayStr || normalizedDatePaid < normalizedOrderDate) {
            Swal.fire('Error', `La fecha ingresada es anterior a la de la generación de la orden: ${normalizedOrderDate}`, 'error');
            reject("Fecha no válida");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const base64String = reader.result as string;
            resolve(base64String);
        };
        reader.onerror = error => {
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
    return formattedDate;
  }

  normalizeDate(dateStr: string): string {
    const date = new Date(dateStr);
    const normalizedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    return normalizedDate;
  }


  subirComprobante(orderId: number, data: { payment_file: string, amount: string, date_paid: string }): void {
    this.conexionService.actualizarOrden(orderId, data).subscribe({
      next: (response) => {
        this.recuperarOrdenes();
        Swal.fire('¡Éxito!', 'Comprobante subido correctamente.', 'success');

        // Actualizar la lista de comprobantes de pago si la respuesta es exitosa y contiene la información necesaria
        if (response.payment_file) {
          const newPayment = {
            id: response.id,  // Asegúrate de que el backend devuelva un ID si es necesario
            payment_file: data.payment_file,
            created_at: new Date().toISOString() // O usa la fecha de pago si el servidor la devuelve
          };
          this.orderDetails.payments_files.push(newPayment);
        }
      },
      error: (error) => {
        Swal.fire('Error', 'Error al subir el comprobante.', 'error');
      }
    });
  }



}





