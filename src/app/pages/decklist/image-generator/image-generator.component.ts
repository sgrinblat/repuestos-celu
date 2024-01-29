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

  async generarImagen(decklist: string, nombreCompleto: string) {

    let acciones = 0;
    let unidades = 0;
    let monumentos = 0;
    let costeUno = 0;
    let costeDos = 0;
    let costeTres = 0;
    let costeCuatro = 0;
    let costeCinco = 0;
    let costeSeis = 0;
    let costeSiete = 0;
    let costeOcho = 0;
    let costeNueve = 0;
    let costeDiez = 0;

    const mapaDeRepeticiones: { [nombre: string]: number } = {};
    for (const carta of this.reino) {

      if(carta.tipo.nombreTipo == "ACCION") {
        acciones++;
      } else {
        if(carta.tipo.nombreTipo.startsWith("UNIDAD")) {
          unidades++;
        } else {
          if(carta.tipo.nombreTipo.startsWith("MONUMENTO")) {
            monumentos++;
          }
        }
      }

      switch(carta.costeCarta) {
        case 1:
            costeUno++;
            break;
        case 2:
            costeDos++;
            break;
        case 3:
            costeTres++;
            break;
        case 4:
            costeCuatro++;
            break;
        case 5:
            costeCinco++;
            break;
        case 6:
            costeSeis++;
            break;
        case 7:
            costeSiete++;
            break;
        case 8:
            costeOcho++;
            break;
        case 9:
            costeNueve++;
            break;
        default:
            // Código en caso de que no haya coincidencia con ningún caso anterior (opcional)
            break;
      }


      if (!mapaDeRepeticiones[carta.nombreCarta]) {
        mapaDeRepeticiones[carta.nombreCarta] = 0;
      }
      mapaDeRepeticiones[carta.nombreCarta]++;
    }

    // Crear contenedor de imágenes
    const contenedor = document.createElement('div');

    const cantidad = Object.keys(mapaDeRepeticiones).length;
    console.log(cantidad)
    if (cantidad === 60) {
      contenedor.style.height = '1400px';
    } else if (cantidad > 49 && cantidad < 60) {
      contenedor.style.height = '1200px';
    } else if (cantidad > 39 && cantidad < 50) {
      contenedor.style.height = '1000px';
    } else if (cantidad > 29 &&cantidad < 40) {
      contenedor.style.height = '1000px';
    } else if (cantidad > 19 && cantidad < 30) {
    } else {
      contenedor.style.height = '1000px';
    }

    contenedor.style.width = '1160px';
    contenedor.style.backgroundImage = 'url("/assets/images/texture.png")';
    contenedor.style.backgroundSize = 'cover'; // La imagen cubre todo el contenedor
    contenedor.style.position = 'relative';
    contenedor.style.overflow = 'hidden';
    document.body.appendChild(contenedor);

    // Después de crear el contenedor y antes de añadir las imágenes

    const divDecklist = document.createElement('div');
    divDecklist.textContent = `Nombre de mazo: ${decklist}`;
    divDecklist.style.position = 'absolute';
    divDecklist.style.left = '20px';
    divDecklist.style.top = '20px';
    divDecklist.style.color = 'white';
    divDecklist.style.fontWeight = 'bold';
    divDecklist.style.fontSize = '24px'; // Ajusta según tus necesidades
    contenedor.appendChild(divDecklist);

    const divNombre = document.createElement('div');
    divNombre.textContent = `Nombre y apellido: ${nombreCompleto}`;
    divNombre.style.position = 'absolute';
    divNombre.style.left = divDecklist.offsetWidth + 40 + 'px'; // 20px de margen inicial + 20px de espacio entre textos
    divNombre.style.top = '20px';
    divNombre.style.color = 'white';
    divNombre.style.fontWeight = 'bold';
    divNombre.style.fontSize = '24px'; // Ajusta según tus necesidades
    contenedor.appendChild(divNombre);

    const divMazo = document.createElement('div');
    //divMazo.textContent = 'Reino: ';
    divMazo.style.position = 'absolute';
    divMazo.style.left = '20px';
    divMazo.style.top = divDecklist.offsetHeight + 40 + 'px'; // 20px de margen inicial + 20px de espacio entre textos
    divMazo.style.color = 'white';
    divMazo.style.fontWeight = 'bold';
    divMazo.style.fontSize = '24px'; // Ajusta según tus necesidades
    contenedor.appendChild(divMazo);



    divMazo.textContent = `Reino: (Acciones: ${acciones} - Unidades: ${unidades} - Monumentos: ${monumentos}) - (Coste 1: ${costeUno} - Coste 2: ${costeDos} - Coste 3: ${costeTres} - Coste 4: ${costeCuatro} - Coste 5: ${costeCinco} - Coste 6: ${costeSeis} - Coste 7: ${costeSiete} - Coste 8: ${costeOcho} - Coste 9: ${costeNueve})`;

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

      // Añade el contenedor de la carta al contenedor principal
      contenedor.appendChild(contenedorCarta);

      const yStartPosition = divMazo.offsetTop + divMazo.offsetHeight + 20;

      // Actualizar la posición y el contador
      currentInRow += 1;

      if (cantidad === 60) {
        if (currentInRow === 10) {
          currentInRow = 0; // Reiniciar contador de imágenes en fila
          xPosition += imageWidth + imageMargin; // Mover a la siguiente columna
          yPosition = yStartPosition; // Usar yStartPosition aquí
        } else {
          yPosition += visiblePortion; // Mover posición vertical solo por la porción visible
        }
      } else if (cantidad > 49 && cantidad < 60) {
        console.log("a ver")
        if (currentInRow === 9) {
          console.log("a ver 2")
          currentInRow = 0; // Reiniciar contador de imágenes en fila
          xPosition += imageWidth + imageMargin; // Mover a la siguiente columna
          yPosition = yStartPosition; // Usar yStartPosition aquí
        } else {
          yPosition += visiblePortion; // Mover posición vertical solo por la porción visible
        }
      } else if (cantidad > 39 && cantidad < 50) {
        if (currentInRow === 8) {
          currentInRow = 0; // Reiniciar contador de imágenes en fila
          xPosition += imageWidth + imageMargin; // Mover a la siguiente columna
          yPosition = yStartPosition; // Usar yStartPosition aquí
        } else {
          yPosition += visiblePortion; // Mover posición vertical solo por la porción visible
        }
      } else if (cantidad > 29 &&cantidad < 40) {
        if (currentInRow === 7) {
          currentInRow = 0; // Reiniciar contador de imágenes en fila
          xPosition += imageWidth + imageMargin; // Mover a la siguiente columna
          yPosition = yStartPosition; // Usar yStartPosition aquí
        } else {
          yPosition += visiblePortion; // Mover posición vertical solo por la porción visible
        }
      } else if (cantidad > 19 && cantidad < 30) {
        if (currentInRow === 6) {
          currentInRow = 0; // Reiniciar contador de imágenes en fila
          xPosition += imageWidth + imageMargin; // Mover a la siguiente columna
          yPosition = yStartPosition; // Usar yStartPosition aquí
        } else {
          yPosition += visiblePortion; // Mover posición vertical solo por la porción visible
        }
      } else {
        if (currentInRow === 5) {
          currentInRow = 0; // Reiniciar contador de imágenes en fila
          xPosition += imageWidth + imageMargin; // Mover a la siguiente columna
          yPosition = yStartPosition; // Usar yStartPosition aquí
        } else {
          yPosition += visiblePortion; // Mover posición vertical solo por la porción visible
        }
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
