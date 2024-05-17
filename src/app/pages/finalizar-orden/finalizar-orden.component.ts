import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { Usuario } from 'src/app/models/usuario';
import { ConexionService } from 'src/app/service/conexion.service';
import { RecaptchaService } from 'src/app/service/recaptcha.service';
import { PasswordStrengthValidator } from '../registro-usuario/registro-usuario.component';
import { ProductService } from 'src/app/service/product.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-finalizar-orden',
  templateUrl: './finalizar-orden.component.html',
  styleUrls: ['./finalizar-orden.component.css']
})
export class FinalizarOrdenComponent implements OnInit {

  contactForm!: FormGroup;
  user: Usuario = new Usuario();
  public robot: boolean;
  public presionado: boolean;

  constructor(private conexionService: ConexionService, private recaptchaService: RecaptchaService,
    private recaptchaV3Service: ReCaptchaV3Service, private readonly fb: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef, private productoService: ProductService,
    private route: Router
    ) {
    this.contactForm = fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      identity_number: ['', [Validators.required, Validators.minLength(8)]],
      email: ['', [Validators.required, Validators.minLength(6), Validators.email]],
      code_area: ['', [Validators.required, Validators.minLength(2)]],
      phone_number: ['', [Validators.required, Validators.minLength(5)]],
      street_address: ['', [Validators.required, Validators.minLength(3)]],
      number_address: ['', [Validators.required, Validators.minLength(1)]],
      postal_code: ['', [Validators.required, Validators.minLength(2)]],
      floor_apartment: ['', [Validators.required, Validators.minLength(2)]],
      state_id: ['none', Validators.required],
      city_id: ['none', Validators.required],
      payment_type_id: ['none', Validators.required],
    });
  }


  provincias: any[] = [];
  ciudades: any[] = [];
  provinciaSeleccionada: any;
  ciudadSeleccionada: any = "null";
  captchaResponse: any = "null";
  paymentMethods: any[] = [];

  productos: any[] = [];

  ngOnInit() {

    this.conexionService.getStates().subscribe(
      data => {
        this.provincias = data.states;
        this.changeDetectorRef.detectChanges();
      },
      error => {
        console.error('Error: ', error);
      }
    );

    if (this.contactForm.get('state_id')) {
      this.contactForm.get('state_id').valueChanges.subscribe(value => {
        this.onProvinciaChange(value);
      });
    }


    this.conexionService.obtenerMediosDePago().subscribe(data => {
      if (data.status) {
        this.paymentMethods = data.paymentsTypes;
        console.log(this.paymentMethods);

      }
    });

    console.log("casi");

    this.productoService.getProducts().subscribe(products => {
      console.log("se");

      this.productos = products;
      console.log('Productos recuperados para finalizar la orden:', this.productos);
    });
  }

  onProvinciaChange(provinciaId: number) {
    if (provinciaId) {
      // Suponiendo que getCiudadesPorProvincia() es el método que obtiene las ciudades según la provincia
      this.conexionService.getCities(provinciaId).subscribe({
        next: (response) => {
          if (response && response.status && Array.isArray(response.cities)) {
            this.ciudades = response.cities; // Asegurándote de que es un array
            this.contactForm.get('ciudadSeleccionada').setValue('none');; // Opcional: Resetear la selección de ciudad
          } else {
            this.ciudades = []; // En caso de que la respuesta no sea el formato esperado
          }
        },
        error: (error) => {
          console.error('Error al cargar las ciudades:', error);
          this.ciudades = []; // Limpiar las ciudades en caso de error
        }
      });
    } else {
      this.ciudades = []; // Si no hay una provincia válida seleccionada, limpiar las ciudades
      this.contactForm.get('ciudadSeleccionada').setValue('none');
    }
  }


  finalizarCompra() {
    // Prepara los datos del formulario como antes, añade los productos y envía todo al servidor
    const orderData = {
      ...this.contactForm.value,
      products: this.productos.map(p => ({ product_id: p.id, quantity: p.quantity }))
    };

    console.log("esto es lo que estoy intentando mandar:");
    console.log(orderData);


    this.conexionService.enviarOrden(orderData).subscribe(
      response => {
        console.log('Orden completada:', response);
        Swal.fire('Orden creada!', 'Ya puedes verla en tu perfil', 'success');
        this.route.navigate(["orden/historial"])
      },
      error => {
        console.error('Error al enviar la orden:', error);
        Swal.fire('Error', 'Hubo un problema para finalizar la orden', 'error');
      }
    );
  }


}
