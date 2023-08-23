import { Component, EventEmitter, Input, Output } from '@angular/core';
import html2canvas from 'html2canvas';
import { Carta } from '../../../carta';



@Component({
  selector: 'app-image-generator',
  templateUrl: './image-generator.component.html',
  styleUrls: ['./image-generator.component.css'] // si tienes estilos específicos
})
export class ImageGeneratorComponent {

  imagenGenerada: string;
  @Input() reino: Carta[] = [];
  @Output() imageGenerated = new EventEmitter<string>();

  constructor() { }

  async generarImagen() {
    // Crear contenedor de imágenes
    const contenedor = document.createElement('div');
    contenedor.style.width = '1080px';
    contenedor.style.height = '1350px';
    contenedor.style.backgroundColor = 'grey';
    contenedor.style.position = 'relative';
    contenedor.style.overflow = 'hidden';
    document.body.appendChild(contenedor);

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
    let yPosition = 20;  // Iniciar con un margen de 20px en la parte superior

    // Tamaño y margen de las imágenes
    const imageWidth = 150;
    const imageMargin = 10;
    const visiblePortion = 80;  // La porción visible de la imagen

    // Iterar sobre las cartas únicas en el mapa de repeticiones
    for (const [nombreCarta, repeticiones] of Object.entries(mapaDeRepeticiones)) {
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
      img.style.left = '0px';
      img.style.top = '0px';
      contenedorCarta.appendChild(img);

      if (repeticiones > 1) {
          const texto = document.createElement('div');
          texto.textContent = `X${repeticiones}`;
          texto.style.position = 'absolute';
          texto.style.color = 'white';
          texto.style.fontWeight = 'bold';
          texto.style.fontSize = '35px';
          texto.style.textShadow = '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000';
          // Estos son los márgenes dentro del contenedor de la carta
          texto.style.right = '10px';
          texto.style.top = '20px';
          texto.style.zIndex = '10';

          contenedorCarta.appendChild(texto);
      }

      // Añade el contenedor de la carta al contenedor principal
      contenedor.appendChild(contenedorCarta);

      // Actualizar la posición y el contador
      currentInRow += 1;
      if (currentInRow === 4) {
          currentInRow = 0;  // Reiniciar contador de imágenes en fila
          xPosition += imageWidth + imageMargin;  // Mover a la siguiente columna
          yPosition = 0;  // Reiniciar posición vertical para la nueva hilera
      } else {
          yPosition += visiblePortion;  // Mover posición vertical solo por la porción visible
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

  private convertToDataURL(element: HTMLElement): Promise<string> {
    return new Promise((resolve, reject) => {
      html2canvas(element, {
        logging: false
      }).then(canvas => {
        resolve(canvas.toDataURL('image/png'));
      }).catch(error => {
        reject(error);
      });
    });
  }
}
