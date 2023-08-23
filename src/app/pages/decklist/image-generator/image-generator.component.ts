import { Component, EventEmitter, Input, Output } from '@angular/core';
import html2canvas from 'html2canvas';
import { Carta } from '../../../carta';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-image-generator',
  templateUrl: './image-generator.component.html',
  styleUrls: ['./image-generator.component.css'], // si tienes estilos específicos
})
export class ImageGeneratorComponent {
  imagenGenerada: string;
  @Input() reino: Carta[] = [];
  @Output() imageGenerated = new EventEmitter<string>();

  constructor() {}

  async generarImagen() {
    // Crear contenedor de imágenes
    const contenedor = document.createElement('div');
    contenedor.style.width = '1080px';
    contenedor.style.height = '670px';
    contenedor.style.backgroundImage = 'url("/assets/images/texture.png")';
    //contenedor.style.backgroundRepeat = 'no-repeat';  // No repetir la imagen de fondo
    contenedor.style.backgroundSize = 'cover'; // La imagen cubre todo el contenedor
    //contenedor.style.backgroundPosition = 'center';  // La imagen se centra en el contenedor
    contenedor.style.position = 'relative';
    contenedor.style.overflow = 'hidden';
    document.body.appendChild(contenedor);

    // Después de crear el contenedor y antes de añadir las imágenes

    Swal.fire({
      title: 'Pon un nombre para tu decklist',
      input: 'text',
      background: '#2e3031',
      color: '#fff',
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        const divDecklist = document.createElement('div');
        divDecklist.textContent = `Nombre de mazo: ${result.value}`;
        divDecklist.style.position = 'absolute';
        divDecklist.style.left = '20px';
        divDecklist.style.top = '20px';
        divDecklist.style.color = 'white';
        divDecklist.style.fontWeight = 'bold';
        divDecklist.style.fontSize = '24px'; // Ajusta según tus necesidades
        contenedor.appendChild(divDecklist);

        Swal.fire({
          title: 'Cuál es tu nombre y apellido?',
          input: 'text',
          background: '#2e3031',
          color: '#fff',
          inputAttributes: {
            autocapitalize: 'off',
          },
          showCancelButton: true,
          confirmButtonText: 'Guardar',
          showLoaderOnConfirm: true,
          allowOutsideClick: () => !Swal.isLoading(),
        }).then(async (result) => {
          if (result.isConfirmed) {
            const divNombre = document.createElement('div');
            divNombre.textContent = `Nombre y apellido: ${result.value}`;
            divNombre.style.position = 'absolute';
            divNombre.style.left = divDecklist.offsetWidth + 40 + 'px'; // 20px de margen inicial + 20px de espacio entre textos
            divNombre.style.top = '20px';
            divNombre.style.color = 'white';
            divNombre.style.fontWeight = 'bold';
            divNombre.style.fontSize = '24px'; // Ajusta según tus necesidades
            contenedor.appendChild(divNombre);

            const divMazo = document.createElement('div');
            divMazo.textContent = 'Mazo Reino: ';
            divMazo.style.position = 'absolute';
            divMazo.style.left = '20px';
            divMazo.style.top = divDecklist.offsetHeight + 40 + 'px'; // 20px de margen inicial + 20px de espacio entre textos
            divMazo.style.color = 'white';
            divMazo.style.fontWeight = 'bold';
            divMazo.style.fontSize = '24px'; // Ajusta según tus necesidades
            contenedor.appendChild(divMazo);


            const mapaDeRepeticiones: { [nombre: string]: number } = {};
            for (const carta of this.reino) {
              if (!mapaDeRepeticiones[carta.nombreCarta]) {
                mapaDeRepeticiones[carta.nombreCarta] = 0;
              }
              mapaDeRepeticiones[carta.nombreCarta]++;
            }

            // Inicializar las posiciones y el contador
            let xPosition = 0;
            let currentInRow = 0;
            let yPosition = divMazo.offsetTop + divMazo.offsetHeight + 20; // Esto considera la posición vertical de "Mazo Reino:" + su altura + 20px de margen.

            // Tamaño y margen de las imágenes
            const imageWidth = 180;
            const imageMargin = 10;
            const visiblePortion = 80; // La porción visible de la imagen

            // Iterar sobre las cartas únicas en el mapa de repeticiones
            for (const [nombreCarta, repeticiones] of Object.entries(
              mapaDeRepeticiones
            )) {
              const rutaImagenLocal = `assets/images/decklists/${nombreCarta}.jpg`;

              // Creamos el contenedor para la carta y su etiqueta
              const contenedorCarta = document.createElement('div');
              contenedorCarta.style.position = 'absolute';
              contenedorCarta.style.left = `${xPosition}px`;
              contenedorCarta.style.top = `${yPosition}px`;
              contenedorCarta.style.width = `${imageWidth}px`;

              // Añade la imagen al contenedor de la carta
              const img = document.createElement('img');
              img.src = rutaImagenLocal;
              img.style.position = 'absolute';
              img.style.width = `${imageWidth}px`;
              img.style.left = '20px';
              img.style.top = '0px';
              contenedorCarta.appendChild(img);

              if (repeticiones > 0) {
                const texto = document.createElement('div');
                texto.textContent = `X${repeticiones}`;
                texto.style.position = 'absolute';
                texto.style.color = 'white';
                texto.style.fontWeight = 'bold';
                texto.style.fontSize = '35px';
                texto.style.textShadow =
                  '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000';
                // Estos son los márgenes dentro del contenedor de la carta
                texto.style.right = '10px';
                texto.style.top = '20px';
                texto.style.zIndex = '10';

                contenedorCarta.appendChild(texto);
              }

              // Añade el contenedor de la carta al contenedor principal
              contenedor.appendChild(contenedorCarta);

              const yStartPosition = divMazo.offsetTop + divMazo.offsetHeight + 20;

              // Actualizar la posición y el contador
              currentInRow += 1;
              if (currentInRow === 4) {
                currentInRow = 0; // Reiniciar contador de imágenes en fila
                xPosition += imageWidth + imageMargin; // Mover a la siguiente columna
                yPosition = yStartPosition; // Usar yStartPosition aquí
              } else {
                yPosition += visiblePortion; // Mover posición vertical solo por la porción visible
              }
            }

            // Convertir contenedor a imagen
            const dataURL = await this.convertToDataURL(contenedor);
            this.imagenGenerada = dataURL;

            // Emitir la imagen generada para el componente padre
            this.imageGenerated.emit(this.imagenGenerada);

            // Eliminar el contenedor del body una vez que hayas obtenido la imagen
            document.body.removeChild(contenedor);


          }
        });
      }
    });

  }

  private convertToDataURL(element: HTMLElement): Promise<string> {
    return new Promise((resolve, reject) => {
      html2canvas(element, {
        logging: false,
      })
        .then((canvas) => {
          resolve(canvas.toDataURL('image/png'));
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
