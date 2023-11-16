import { Component, OnInit, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable} from 'rxjs';
import { ElementRef } from '@angular/core';


import Swal from 'sweetalert2';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

import { ConexionService } from 'src/app/service/conexion.service';
import { Carta } from '../../carta';
import { Rareza } from 'src/app/rareza';
import { Expansion } from '../../expansion';
import { Tipo } from '../../tipo';
import { Decklist } from 'src/app/decklist';
import { Usuario } from 'src/app/usuario';
import { Input } from '@angular/core';
import { DeckListCarta } from 'src/app/deckListCarta';
import { ImageGeneratorComponent } from './image-generator/image-generator.component';
import { ImageBovedaDeckComponent } from './image-boveda-deck/image-boveda-deck.component';
import { ImageSidedeckComponent } from './image-sidedeck/image-sidedeck.component';
import { isPlatformBrowser } from '@angular/common';
import { Subtipo } from 'src/app/subtipo';

@Component({
  selector: 'app-decklist',
  templateUrl: './decklist.component.html',
  styleUrls: ['./decklist.component.css'],
})
export class DecklistComponent implements OnInit {
  private chart: any = null;
  searchText: string | null = null;
  selectedRareza: number | null = null;
  selectedExpansion: number | null = null;
  selectedTipo: number | null = null;
  selectedCoste: number | null = null;
  selectedSubTipo: number | null = null;
  selectedSubTipo2: number | null = null;
  selectedSubTipo3: number | null = null;
  filteredCartas: Carta[] = [];
  cartas!: Carta[];
  decklists!: Decklist[];
  costes: number[] = [];
  deck: Decklist;

  expansiones: Observable<Expansion[]>;
  rarezas: Rareza[] = [];
  tipos: Tipo[] = [];
  subtipos: Subtipo[] = [];

  reino: Carta[];
  boveda: Carta[];
  sidedeck: Carta[];

  banderaLista = true;
  banderaEdicion = false;
  imagenGenerada: string;
  imagenGeneradaBoveda: string;
  imagenGeneradaSideDeck: string;
  imagenCombinada: string;
  banderaImagenGenerada: boolean = false;

  constructor(
    private conexion: ConexionService,
    private activatedRoute: ActivatedRoute,
    private route: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.reino = new Array<Carta>();
    this.boveda = new Array<Carta>();
    this.sidedeck = new Array<Carta>();
  }

  @Input()
  decklistId: number | null = null;

  @ViewChild('imageGenerator') imageGeneratorComponent: ImageGeneratorComponent;
  @ViewChild('imageBoveda') ImageBovedaDeckComponent: ImageBovedaDeckComponent;
  @ViewChild('imageSideDeck') ImageSidedeckComponent: ImageSidedeckComponent;

  generarImagen() {
    let decklist: string;
    let nombreCompleto: string;

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
        decklist = result.value;

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
        }).then((result) => {
          if (result.isConfirmed) {
            nombreCompleto = result.value;
            Loading.hourglass();
            const image1Promise = new Promise<string>(resolve => {
              this.onImageGenerated = (imageUrl: string) => {
                  resolve(imageUrl);
              };
              this.imageGeneratorComponent.generarImagen(decklist, nombreCompleto);
          });

          const image2Promise = new Promise<string>(resolve => {
              this.onImageGeneratedBoveda = (imageUrl: string) => {
                  resolve(imageUrl);
              };
              this.ImageBovedaDeckComponent.generarImagen(decklist, nombreCompleto);
          });

          const image3Promise = new Promise<string>(resolve => {
              this.onImageGeneratedSideDeck = (imageUrl: string) => {
                  resolve(imageUrl);
              };
              this.ImageSidedeckComponent.generarImagen(decklist, nombreCompleto);
          });

          // Esperar a que todas las imágenes estén generadas
          Promise.all([image1Promise, image2Promise, image3Promise])
              .then(([img1, img2, img3]) => {
                  this.combinaImagenes(img1, img2, img3);
                  this.banderaImagenGenerada = true;
                  Loading.remove();
                  Swal.fire(
                    'Imagen generada correctamente',
                    `Ya puedes volver a presionar el botón para descargar la imagen de tu decklist ${decklist}!`,
                    `success`
                  );
              });

          }
        });
      }
    });
  }

  onImageGenerated(imageUrl: string) {
    this.imagenGenerada = imageUrl;
  }

  onImageGeneratedBoveda(imageUrl: string) {
      this.imagenGeneradaBoveda = imageUrl;
  }

  onImageGeneratedSideDeck(imageUrl: string) {
      this.imagenGeneradaSideDeck = imageUrl;
  }


  combinaImagenes(img1Src: string, img2Src: string, img3Src: string) {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');

    let img1 = new Image();
    let img2 = new Image();
    let img3 = new Image();

    let img1Promise = new Promise((resolve, reject) => {
        img1.onload = resolve;
        img1.onerror = reject;
        img1.src = img1Src;
    });

    let img2Promise = new Promise((resolve, reject) => {
        img2.onload = resolve;
        img2.onerror = reject;
        img2.src = img2Src;
    });

    let img3Promise = new Promise((resolve, reject) => {
        img3.onload = resolve;
        img3.onerror = reject;
        img3.src = img3Src;
    });

    Promise.all([img1Promise, img2Promise, img3Promise]).then(() => {
        canvas.width = img1.width;  // Asume que todas las imágenes tienen el mismo ancho
        canvas.height = img1.height + img2.height + img3.height;

        ctx.drawImage(img1, 0, 0);
        ctx.drawImage(img2, 0, img1.height);
        ctx.drawImage(img3, 0, img1.height + img2.height);

        this.imagenCombinada = canvas.toDataURL('image/png');
    }).catch(error => {
        console.error("Hubo un error cargando las imágenes: ", error);
    });
  }


  esMovil: boolean = false;

  detectarMovil(): boolean {
    // Un simple chequeo para dispositivos móviles basado en el ancho de la ventana. Ajusta el valor según tus necesidades.
    return window.innerWidth <= 800;
  }


  ngOnInit(): void {
    this.esMovil = this.detectarMovil();
    this.activatedRoute.params.subscribe((params) => {
      this.decklistId = params['id'];

      if (this.decklistId != null) {
        this.conexion.getDecklistById(this.decklistId).subscribe((decklist) => {
          this.deck = decklist;
          this.conexion.getUsuarioActual().subscribe((usuario: Usuario) => {
            if (decklist.usuario.id == usuario.id) {
              let deckReino: DeckListCarta[] = decklist.reino;
              let deckBoveda: DeckListCarta[] = decklist.boveda;
              let deckSidedeck: DeckListCarta[] = decklist.sidedeck;

              deckReino.forEach((element) => {
                if (element.tipo == 'reino') {
                  this.reino.push(element.carta);
                }
              });

              deckBoveda.forEach((element) => {
                if (element.tipo == 'boveda') {
                  this.boveda.push(element.carta);
                }
              });

              deckSidedeck.forEach((element) => {
                if (element.tipo == 'sidedeck') {
                  this.sidedeck.push(element.carta);
                }
              });

              this.banderaEdicion = true;
            }
          });
        });
      }
    });

    this.obtenerCartas();
    this.expansiones = this.conexion.getTodasLasExpas();

    this.conexion.getTodasLasRarezas().pipe(
      map(rarezas => {
        const order = ['BRONCE', 'PLATA', 'ORO', 'DIAMANTE', 'ESMERALDA'];
        return rarezas.sort((a, b) => order.indexOf(a.nombreRareza) - order.indexOf(b.nombreRareza));
      })
    ).subscribe(rarezas => {
      this.rarezas = rarezas;
    });

    this.conexion
      .getTodasLosTipos()
      .pipe(
        map((tipos) =>
          tipos.sort((a, b) => a.nombreTipo.localeCompare(b.nombreTipo))
        )
      )
      .subscribe((tipos) => {
        this.tipos = tipos;
      });

      this.conexion.getTodasLosSubTipos().pipe(
        map(subtipos => subtipos.sort((a, b) => a.nombreSubTipo.localeCompare(b.nombreSubTipo)))
      ).subscribe(subtipos => {
        this.subtipos = subtipos;
      });
  }

  onRarezaChange(selectedRareza: number) {
    this.selectedRareza = selectedRareza;
    if(this.selectedRareza == 0) {
      this.selectedRareza = null;
    }
    this.filterCartas();
  }

  onExpansionChange(selectedExpansion: number) {
    this.selectedExpansion = selectedExpansion;
    if(this.selectedExpansion == 0) {
      this.selectedExpansion = null;
    }
    this.filterCartas();
  }

  onTipoChange(selectedTipo: number) {
    this.selectedTipo = selectedTipo;
    if(this.selectedTipo == 0) {
      this.selectedTipo = null;
    }
    this.filterCartas();
  }

  onCosteChange(selectedCoste: number) {
    this.selectedCoste = selectedCoste;
    if(this.selectedCoste == 0) {
      this.selectedCoste = null;
    }
    this.filterCartas();
  }

  onSubTipoChange(selectedSubTipo: number) {
    this.selectedSubTipo = selectedSubTipo;
    if(this.selectedSubTipo == 0) {
      this.selectedSubTipo = null;
    }
    this.filterCartas();
  }
  onSubTipo2Change(selectedSubTipo2: number) {
    this.selectedSubTipo2 = selectedSubTipo2;
    if(this.selectedSubTipo2 == 0) {
      this.selectedSubTipo2 = null;
    }
    this.filterCartas();
  }
  onSubTipo3Change(selectedSubTipo3: number) {
    this.selectedSubTipo3 = selectedSubTipo3;
    if(this.selectedSubTipo3 == 0) {
      this.selectedSubTipo3 = null;
    }
    this.filterCartas();
  }

  searchByText() {
    this.filteredCartas = this.cartas.filter((carta) => {
      if (carta.nombreCarta.includes(this.searchText)) {
        return true;
      } else {
        return false;
      }
    });
  }

  filterCartas() {
    this.filteredCartas = this.cartas.filter(carta => {
      // FILTRO DE 7
      if(this.selectedExpansion !== null && this.selectedRareza !== null && this.selectedTipo !== null && this.selectedCoste !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null) {
        if(carta.rareza.idRareza == this.selectedRareza
          && carta.tipo.idTipo == this.selectedTipo
          && carta.expansion.idExpansion == this.selectedExpansion
          && carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 6
      if(this.selectedExpansion !== null && this.selectedRareza !== null && this.selectedTipo !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null
        ) {
        if(carta.rareza.idRareza == this.selectedRareza
          && carta.tipo.idTipo == this.selectedTipo
          && carta.expansion.idExpansion == this.selectedExpansion
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 6
      if(this.selectedRareza !== null && this.selectedTipo !== null && this.selectedCoste !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null
        ) {
        if(carta.rareza.idRareza == this.selectedRareza
          && carta.tipo.idTipo == this.selectedTipo
          && carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 6
      if(this.selectedExpansion !== null && this.selectedTipo !== null && this.selectedCoste !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.expansion.idExpansion == this.selectedExpansion
          && carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 6
      if(this.selectedExpansion !== null && this.selectedRareza !== null && this.selectedCoste !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null
        ) {
        if(carta.rareza.idRareza == this.selectedRareza
          && carta.expansion.idExpansion == this.selectedExpansion
          && carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 6
      if(this.selectedExpansion !== null && this.selectedRareza !== null && this.selectedCoste !== null && this.selectedTipo !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null
        ) {
        if(carta.rareza.idRareza == this.selectedRareza
          && carta.tipo.idTipo == this.selectedTipo
          && carta.expansion.idExpansion == this.selectedExpansion
          && carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 6
      if(this.selectedExpansion !== null && this.selectedRareza !== null && this.selectedCoste !== null && this.selectedTipo !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo3 !== null
        ) {
        if(carta.rareza.idRareza == this.selectedRareza
          && carta.tipo.idTipo == this.selectedTipo
          && carta.expansion.idExpansion == this.selectedExpansion
          && carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 6
      if(this.selectedExpansion !== null && this.selectedRareza !== null && this.selectedCoste !== null && this.selectedTipo !== null
        && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null
        ) {
        if(carta.rareza.idRareza == this.selectedRareza
          && carta.tipo.idTipo == this.selectedTipo
          && carta.expansion.idExpansion == this.selectedExpansion
          && carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 5
      if(this.selectedExpansion !== null && this.selectedRareza !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null
        ) {
        if(carta.rareza.idRareza == this.selectedRareza
          && carta.expansion.idExpansion == this.selectedExpansion
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 5
      if(this.selectedExpansion !== null && this.selectedTipo !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.expansion.idExpansion == this.selectedExpansion
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 5
      if(this.selectedTipo !== null && this.selectedCoste !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 5
      if(this.selectedExpansion !== null && this.selectedCoste !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null
        ) {
        if(carta.expansion.idExpansion == this.selectedExpansion
          && carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 5
      if(this.selectedRareza !== null && this.selectedCoste !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null
        ) {
        if(carta.rareza.idRareza == this.selectedRareza
          && carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 5
      if(this.selectedRareza !== null && this.selectedTipo !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 5
      if(this.selectedRareza !== null && this.selectedTipo !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null && this.selectedCoste !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && carta.costeCarta == this.selectedCoste
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 5
      if(this.selectedRareza !== null && this.selectedTipo !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo3 !== null && this.selectedCoste !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          && carta.costeCarta == this.selectedCoste
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 5
      if(this.selectedRareza !== null && this.selectedTipo !== null
        && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null && this.selectedCoste !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          && carta.costeCarta == this.selectedCoste
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 5
      if(this.selectedRareza !== null && this.selectedTipo !== null
        && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null && this.selectedExpansion !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 5
      if(this.selectedRareza !== null && this.selectedTipo !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null && this.selectedExpansion !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 5
      if(this.selectedRareza !== null && this.selectedTipo !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo3 !== null && this.selectedExpansion !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 5
      if(this.selectedRareza !== null && this.selectedTipo !== null
        && this.selectedSubTipo !== null && this.selectedCoste !== null && this.selectedExpansion !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && carta.costeCarta == this.selectedCoste
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 5
      if(this.selectedRareza !== null && this.selectedTipo !== null
        && this.selectedSubTipo2 !== null && this.selectedCoste !== null && this.selectedExpansion !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && carta.costeCarta == this.selectedCoste
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 5
      if(this.selectedRareza !== null && this.selectedTipo !== null
        && this.selectedSubTipo3 !== null && this.selectedCoste !== null && this.selectedExpansion !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          && carta.costeCarta == this.selectedCoste
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 5
      if(this.selectedRareza !== null && this.selectedExpansion !== null
        && this.selectedSubTipo3 !== null && this.selectedCoste !== null && this.selectedSubTipo !== null
        ) {
        if((this.compararSubtipos(this.selectedSubTipo, carta))
          && carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          && carta.costeCarta == this.selectedCoste
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 5
      if(this.selectedRareza !== null && this.selectedExpansion !== null
        && this.selectedSubTipo2 !== null && this.selectedCoste !== null && this.selectedSubTipo !== null
        ) {
        if((this.compararSubtipos(this.selectedSubTipo, carta))
          && carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && carta.costeCarta == this.selectedCoste
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 5
      if(this.selectedRareza !== null && this.selectedExpansion !== null
        && this.selectedSubTipo3 !== null && this.selectedCoste !== null && this.selectedSubTipo2 !== null
        ) {
        if((this.compararSubtipos(this.selectedSubTipo2, carta))
          && carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          && carta.costeCarta == this.selectedCoste
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 5
      if(this.selectedExpansion !== null && this.selectedTipo !== null
        && this.selectedSubTipo3 !== null && this.selectedCoste !== null && this.selectedSubTipo !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          && carta.costeCarta == this.selectedCoste
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 5
      if(this.selectedExpansion !== null && this.selectedTipo !== null
        && this.selectedSubTipo2 !== null && this.selectedCoste !== null && this.selectedSubTipo !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && carta.costeCarta == this.selectedCoste
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 5
      if(this.selectedExpansion !== null && this.selectedTipo !== null
        && this.selectedSubTipo3 !== null && this.selectedCoste !== null && this.selectedSubTipo2 !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          && carta.costeCarta == this.selectedCoste
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }


      // FILTRO DE 4
      if(this.selectedRareza !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null
        ) {
        if(carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 4
      if(this.selectedTipo !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 4
      if(this.selectedExpansion !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null
        ) {
        if(carta.expansion.idExpansion == this.selectedExpansion
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 4
      if(this.selectedCoste !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null
        ) {
        if(carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 4
      if(this.selectedCoste !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null && this.selectedExpansion !== null
        ) {
        if(carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 4
      if(this.selectedCoste !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo3 !== null && this.selectedExpansion !== null
        ) {
        if(carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 4
      if(this.selectedCoste !== null
        && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null && this.selectedExpansion !== null
        ) {
        if(carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 4
      if(this.selectedCoste !== null
        && this.selectedSubTipo !== null && this.selectedRareza !== null && this.selectedExpansion !== null
        ) {
        if(carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && carta.rareza.idRareza == this.selectedRareza
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 4
      if(this.selectedCoste !== null
        && this.selectedSubTipo2 !== null && this.selectedRareza !== null && this.selectedExpansion !== null
        ) {
        if(carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && carta.rareza.idRareza == this.selectedRareza
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 4
      if(this.selectedCoste !== null
        && this.selectedSubTipo3 !== null && this.selectedRareza !== null && this.selectedExpansion !== null
        ) {
        if(carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          && carta.rareza.idRareza == this.selectedRareza
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 4
      if(this.selectedCoste !== null
        && this.selectedSubTipo !== null && this.selectedTipo !== null && this.selectedExpansion !== null
        ) {
        if(carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && carta.tipo.idTipo == this.selectedTipo
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 4
      if(this.selectedCoste !== null
        && this.selectedSubTipo2 !== null && this.selectedTipo !== null && this.selectedExpansion !== null
        ) {
        if(carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && carta.tipo.idTipo == this.selectedTipo
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 4
      if(this.selectedCoste !== null
        && this.selectedSubTipo3 !== null && this.selectedTipo !== null && this.selectedExpansion !== null
        ) {
        if(carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          && carta.tipo.idTipo == this.selectedTipo
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 4
      if(this.selectedCoste !== null
        && this.selectedRareza !== null && this.selectedTipo !== null && this.selectedExpansion !== null
        ) {
        if(carta.costeCarta == this.selectedCoste
          && carta.rareza.idRareza == this.selectedRareza
          && carta.tipo.idTipo == this.selectedTipo
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 4 AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
      if(this.selectedCoste !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo3 !== null && this.selectedRareza !== null
        ) {
        if(carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 4
      if(this.selectedCoste !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null && this.selectedRareza !== null
        ) {
        if(carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && carta.rareza.idRareza == this.selectedRareza
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 4
      if(this.selectedCoste !== null
        && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null && this.selectedRareza !== null
        ) {
        if(carta.costeCarta == this.selectedCoste
          && carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 4
      if(this.selectedTipo !== null
        && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null && this.selectedRareza !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 4
      if(this.selectedTipo !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo3 !== null && this.selectedRareza !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 4
      if(this.selectedTipo !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null && this.selectedRareza !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 4
      if(this.selectedTipo !== null
        && this.selectedSubTipo !== null && this.selectedCoste !== null && this.selectedRareza !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && carta.costeCarta
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 4
      if(this.selectedTipo !== null
        && this.selectedSubTipo2 !== null && this.selectedCoste !== null && this.selectedRareza !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && carta.costeCarta
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 4
      if(this.selectedTipo !== null
        && this.selectedSubTipo3 !== null && this.selectedCoste !== null && this.selectedRareza !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          && carta.costeCarta
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 4
      if(this.selectedTipo !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo3 !== null && this.selectedExpansion !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.expansion.idExpansion == this.selectedExpansion
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 4
      if(this.selectedTipo !== null
        && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null && this.selectedExpansion !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.expansion.idExpansion == this.selectedExpansion
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 4
      if(this.selectedTipo !== null
        && this.selectedSubTipo2 !== null && this.selectedSubTipo2 !== null && this.selectedExpansion !== null
        ) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.expansion.idExpansion == this.selectedExpansion
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 4
      if(this.selectedRareza !== null
        && this.selectedSubTipo !== null && this.selectedSubTipo3 !== null && this.selectedExpansion !== null
        ) {
        if(carta.rareza.idRareza == this.selectedRareza
          && carta.expansion.idExpansion == this.selectedExpansion
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 4
      if(this.selectedRareza !== null
        && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null && this.selectedExpansion !== null
        ) {
        if(carta.rareza.idRareza == this.selectedRareza
          && carta.expansion.idExpansion == this.selectedExpansion
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 4
      if(this.selectedRareza !== null
        && this.selectedSubTipo2 !== null && this.selectedSubTipo2 !== null && this.selectedExpansion !== null
        ) {
        if(carta.rareza.idRareza == this.selectedRareza
          && carta.expansion.idExpansion == this.selectedExpansion
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 4
      if(this.selectedCoste !== null
        && this.selectedSubTipo2 !== null && this.selectedSubTipo2 !== null && this.selectedTipo !== null
        ) {
        if(carta.costeCarta == this.selectedCoste
          && carta.tipo.idTipo == this.selectedTipo
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 4
      if(this.selectedCoste !== null
        && this.selectedSubTipo2 !== null && this.selectedSubTipo2 !== null && this.selectedTipo !== null
        ) {
        if(carta.costeCarta == this.selectedCoste
          && carta.tipo.idTipo == this.selectedTipo
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 4
      if(this.selectedCoste !== null
        && this.selectedSubTipo2 !== null && this.selectedSubTipo2 !== null && this.selectedTipo !== null
        ) {
        if(carta.costeCarta == this.selectedCoste
          && carta.tipo.idTipo == this.selectedTipo
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }


      // FILTRO DE 4
      if(this.selectedExpansion !== null
        && this.selectedSubTipo !== null && this.selectedTipo !== null && this.selectedRareza !== null
        ) {
        if(carta.rareza.idRareza == this.selectedRareza
          && carta.tipo.idTipo == this.selectedTipo
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 4
      if(this.selectedExpansion !== null
        && this.selectedSubTipo2 !== null && this.selectedTipo !== null && this.selectedRareza !== null
        ) {
        if(carta.rareza.idRareza == this.selectedRareza
          && carta.tipo.idTipo == this.selectedTipo
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 4
      if(this.selectedExpansion !== null
        && this.selectedSubTipo3 !== null && this.selectedTipo !== null && this.selectedRareza !== null
        ) {
        if(carta.rareza.idRareza == this.selectedRareza
          && carta.tipo.idTipo == this.selectedTipo
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }






      // FILTROS DE A 3
      if(this.selectedRareza !== null && this.selectedTipo !== null && this.selectedExpansion !== null) {
        if(carta.rareza.idRareza == this.selectedRareza
          && carta.tipo.idTipo == this.selectedTipo
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }
      if(this.selectedRareza !== null && this.selectedTipo !== null && this.selectedCoste !== null) {
        if(carta.rareza.idRareza == this.selectedRareza
          && carta.tipo.idTipo == this.selectedTipo
          && carta.costeCarta == this.selectedCoste
          )
          {
            return true;
          } else {
            return false;
          }
      }
      if(this.selectedCoste !== null && this.selectedExpansion !== null && this.selectedRareza !== null) {
        if(carta.rareza.idRareza == this.selectedRareza
          && carta.expansion.idExpansion == this.selectedExpansion
          && carta.costeCarta == this.selectedCoste
          )
          {
            return true;
          } else {
            return false;
          }
      }
      //



      // FILTROS DE A 3
      if(this.selectedRareza !== null && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null) {
        if(carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      if(this.selectedRareza !== null && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null) {
        if(carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      if(this.selectedRareza !== null && this.selectedSubTipo3 !== null && this.selectedSubTipo !== null) {
        if(carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      //

      // FILTROS DE A 3
      if(this.selectedExpansion !== null && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null) {
        if(carta.expansion.idExpansion == this.selectedExpansion
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      if(this.selectedExpansion !== null && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null) {
        if(carta.expansion.idExpansion == this.selectedExpansion
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      if(this.selectedExpansion !== null && this.selectedSubTipo3 !== null && this.selectedSubTipo !== null) {
        if(carta.expansion.idExpansion == this.selectedExpansion
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      //

      // FILTROS DE A 3
      if(this.selectedTipo !== null && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null) {
        if(carta.tipo.idTipo == this.selectedTipo
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      if(this.selectedTipo !== null && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null) {
        if(carta.tipo.idTipo == this.selectedTipo
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      if(this.selectedTipo !== null && this.selectedSubTipo3 !== null && this.selectedSubTipo !== null) {
        if(carta.tipo.idTipo == this.selectedTipo
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      //

      // FILTROS DE A 3
      if(this.selectedCoste !== null && this.selectedSubTipo !== null && this.selectedSubTipo2 !== null) {
        if(carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      if(this.selectedCoste !== null && this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null) {
        if(carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      if(this.selectedCoste !== null && this.selectedSubTipo3 !== null && this.selectedSubTipo !== null) {
        if(carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      //

      // FILTRO DE 3
      if(this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null && this.selectedSubTipo !== null) {
        if((this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }


      // FILTRO DE 3
      if(this.selectedExpansion !== null && this.selectedTipo !== null && this.selectedCoste !== null) {
        if(carta.costeCarta == this.selectedCoste
          && carta.expansion.idExpansion == this.selectedExpansion
          && carta.tipo.idTipo == this.selectedTipo
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 3
      if(this.selectedExpansion !== null && this.selectedTipo !== null && this.selectedSubTipo !== null) {
        if((this.compararSubtipos(this.selectedSubTipo, carta))
          && carta.expansion.idExpansion == this.selectedExpansion
          && carta.tipo.idTipo == this.selectedTipo
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 3
      if(this.selectedExpansion !== null && this.selectedTipo !== null && this.selectedSubTipo2 !== null) {
        if((this.compararSubtipos(this.selectedSubTipo2, carta))
          && carta.expansion.idExpansion == this.selectedExpansion
          && carta.tipo.idTipo == this.selectedTipo
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 3
      if(this.selectedExpansion !== null && this.selectedTipo !== null && this.selectedSubTipo3 !== null) {
        if((this.compararSubtipos(this.selectedSubTipo3, carta))
          && carta.expansion.idExpansion == this.selectedExpansion
          && carta.tipo.idTipo == this.selectedTipo
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 3
      if(this.selectedExpansion !== null && this.selectedRareza !== null && this.selectedSubTipo !== null) {
        if((this.compararSubtipos(this.selectedSubTipo, carta))
          && carta.expansion.idExpansion == this.selectedExpansion
          && carta.rareza.idRareza == this.selectedRareza
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 3
      if(this.selectedExpansion !== null && this.selectedRareza !== null && this.selectedSubTipo2 !== null) {
        if((this.compararSubtipos(this.selectedSubTipo2, carta))
          && carta.expansion.idExpansion == this.selectedExpansion
          && carta.rareza.idRareza == this.selectedRareza
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 3
      if(this.selectedExpansion !== null && this.selectedRareza !== null && this.selectedSubTipo3 !== null) {
        if((this.compararSubtipos(this.selectedSubTipo3, carta))
          && carta.expansion.idExpansion == this.selectedExpansion
          && carta.rareza.idRareza == this.selectedRareza
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 3
      if(this.selectedExpansion !== null && this.selectedCoste !== null && this.selectedSubTipo !== null) {
        if((this.compararSubtipos(this.selectedSubTipo, carta))
          && carta.expansion.idExpansion == this.selectedExpansion
          && carta.costeCarta == this.selectedCoste
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 3
      if(this.selectedExpansion !== null && this.selectedCoste !== null && this.selectedSubTipo2 !== null) {
        if((this.compararSubtipos(this.selectedSubTipo2, carta))
          && carta.expansion.idExpansion == this.selectedExpansion
          && carta.costeCarta == this.selectedCoste
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 3
      if(this.selectedExpansion !== null && this.selectedCoste !== null && this.selectedSubTipo3 !== null) {
        if((this.compararSubtipos(this.selectedSubTipo3, carta))
          && carta.expansion.idExpansion == this.selectedExpansion
          && carta.costeCarta == this.selectedCoste
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 3
      if(this.selectedRareza !== null && this.selectedCoste !== null && this.selectedSubTipo !== null) {
        if((this.compararSubtipos(this.selectedSubTipo, carta))
          && carta.rareza.idRareza == this.selectedRareza
          && carta.costeCarta == this.selectedCoste
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 3
      if(this.selectedRareza !== null && this.selectedCoste !== null && this.selectedSubTipo2 !== null) {
        if((this.compararSubtipos(this.selectedSubTipo2, carta))
          && carta.rareza.idRareza == this.selectedRareza
          && carta.costeCarta == this.selectedCoste
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 3
      if(this.selectedRareza !== null && this.selectedCoste !== null && this.selectedSubTipo3 !== null) {
        if((this.compararSubtipos(this.selectedSubTipo3, carta))
          && carta.rareza.idRareza == this.selectedRareza
          && carta.costeCarta == this.selectedCoste
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 3
      if(this.selectedTipo !== null && this.selectedCoste !== null && this.selectedSubTipo !== null) {
        if((this.compararSubtipos(this.selectedSubTipo, carta))
          && carta.tipo.idTipo == this.selectedTipo
          && carta.costeCarta == this.selectedCoste
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 3
      if(this.selectedTipo !== null && this.selectedCoste !== null && this.selectedSubTipo2 !== null) {
        if((this.compararSubtipos(this.selectedSubTipo2, carta))
          && carta.tipo.idTipo == this.selectedTipo
          && carta.costeCarta == this.selectedCoste
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 3
      if(this.selectedTipo !== null && this.selectedCoste !== null && this.selectedSubTipo3 !== null) {
        if((this.compararSubtipos(this.selectedSubTipo3, carta))
          && carta.tipo.idTipo == this.selectedTipo
          && carta.costeCarta == this.selectedCoste
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTRO DE 3
      if(this.selectedTipo !== null && this.selectedRareza !== null && this.selectedSubTipo !== null) {
        if((this.compararSubtipos(this.selectedSubTipo, carta))
          && carta.tipo.idTipo == this.selectedTipo
          && carta.rareza.idRareza == this.selectedRareza
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 3
      if(this.selectedTipo !== null && this.selectedRareza !== null && this.selectedSubTipo2 !== null) {
        if((this.compararSubtipos(this.selectedSubTipo2, carta))
          && carta.tipo.idTipo == this.selectedTipo
          && carta.rareza.idRareza == this.selectedRareza
          )
          {
            return true;
          } else {
            return false;
          }
      }
      // FILTRO DE 3
      if(this.selectedTipo !== null && this.selectedRareza !== null && this.selectedSubTipo3 !== null) {
        if((this.compararSubtipos(this.selectedSubTipo3, carta))
          && carta.tipo.idTipo == this.selectedTipo
          && carta.rareza.idRareza == this.selectedRareza
          )
          {
            return true;
          } else {
            return false;
          }
      }


      // FILTROS DE A 2
      if(this.selectedTipo !== null && this.selectedRareza !== null) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.rareza.idRareza == this.selectedRareza
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTROS DE A 2
      if(this.selectedTipo !== null && this.selectedExpansion !== null) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTROS DE A 2
      if(this.selectedTipo !== null && this.selectedCoste !== null) {
        if(carta.tipo.idTipo == this.selectedTipo
          && carta.costeCarta == this.selectedCoste
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTROS DE A 2
      if(this.selectedRareza !== null && this.selectedCoste !== null) {
        if(carta.rareza.idRareza == this.selectedRareza
          && carta.costeCarta == this.selectedCoste
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTROS DE A 2
      if(this.selectedExpansion !== null && this.selectedCoste !== null) {
        if(carta.expansion.idExpansion == this.selectedExpansion
          && carta.costeCarta == this.selectedCoste
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTROS DE A 2
      if(this.selectedRareza !== null && this.selectedExpansion !== null) {
        if(carta.rareza.idRareza == this.selectedRareza
          && carta.expansion.idExpansion == this.selectedExpansion
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTROS DE A 2
      if(this.selectedTipo !== null && this.selectedSubTipo !== null) {
        if(carta.tipo.idTipo == this.selectedTipo
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      if(this.selectedTipo !== null && this.selectedSubTipo2 !== null) {
        if(carta.tipo.idTipo == this.selectedTipo
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      if(this.selectedTipo !== null && this.selectedSubTipo3 !== null) {
        if(carta.tipo.idTipo == this.selectedTipo
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTROS DE A 2
      if(this.selectedRareza !== null && this.selectedSubTipo !== null) {
        if(carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      if(this.selectedRareza !== null && this.selectedSubTipo2 !== null) {
        if(carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      if(this.selectedRareza !== null && this.selectedSubTipo3 !== null) {
        if(carta.rareza.idRareza == this.selectedRareza
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      //

      // FILTROS DE A 2
      if(this.selectedExpansion !== null && this.selectedSubTipo !== null) {
        if(carta.expansion.idExpansion == this.selectedExpansion
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      if(this.selectedExpansion !== null && this.selectedSubTipo2 !== null) {
        if(carta.expansion.idExpansion == this.selectedExpansion
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      if(this.selectedExpansion !== null && this.selectedSubTipo3 !== null) {
        if(carta.expansion.idExpansion == this.selectedExpansion
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      //

      // FILTROS DE A 2
      if(this.selectedCoste !== null && this.selectedSubTipo !== null) {
        if(carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      if(this.selectedCoste !== null && this.selectedSubTipo2 !== null) {
        if(carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      if(this.selectedCoste !== null && this.selectedSubTipo3 !== null) {
        if(carta.costeCarta == this.selectedCoste
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }

      // FILTROS DE A 2
      if(this.selectedSubTipo !== null && this.selectedSubTipo2 !== null) {
        if((this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo2, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      if(this.selectedSubTipo !== null && this.selectedSubTipo3 !== null) {
        if((this.compararSubtipos(this.selectedSubTipo, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      if(this.selectedSubTipo2 !== null && this.selectedSubTipo3 !== null) {
        if((this.compararSubtipos(this.selectedSubTipo2, carta))
          && (this.compararSubtipos(this.selectedSubTipo3, carta))
          )
          {
            return true;
          } else {
            return false;
          }
      }
      //

      // FILTROS DE 1
      if(this.selectedRareza !== null) {
        if(carta.rareza.idRareza == this.selectedRareza)
          {
            return true;
          } else {
            return false;
          }
      }
      if(this.selectedExpansion !== null) {
        if(carta.expansion.idExpansion == this.selectedExpansion)
          {
            return true;
          } else {
            return false;
          }
      }
      if(this.selectedTipo !== null) {
        if(carta.tipo.idTipo == this.selectedTipo)
          {
            return true;
          } else {
            return false;
          }
      }

      if(this.selectedCoste !== null) {
        if(carta.costeCarta == this.selectedCoste)
          {
            return true;
          } else {
            return false;
          }
      }

      if(this.selectedSubTipo !== null) {
        return this.compararSubtipos(this.selectedSubTipo, carta);
      }
      if(this.selectedSubTipo2 !== null) {
        return this.compararSubtipos(this.selectedSubTipo2, carta);
      }
      if(this.selectedSubTipo3 !== null) {
        return this.compararSubtipos(this.selectedSubTipo3, carta);
      }

      return false;
    });
  }

  subtipoSeleccionado(id1, id2, id3, carta) {
    if(id1 !== null) {
      return this.compararSubtipos(id1, carta);
    }
    if(id2 !== null) {
      return this.compararSubtipos(id2, carta);
    }
    if(id3 !== null) {
      return this.compararSubtipos(id3, carta);
    }

    return false;
  }

  compararSubtipos(idSubtipo: number, carta: Carta) {
    if(carta.subtipo && carta.subtipo2 && carta.subtipo3) {
      if(carta.subtipo.idSubTipo == idSubtipo || carta.subtipo2.idSubTipo == idSubtipo || carta.subtipo3.idSubTipo == idSubtipo) {
        return true
      } else {
        return false;
      }
    } else {
      if(carta.subtipo2 && carta.subtipo3) {
        if(carta.subtipo2.idSubTipo == idSubtipo || carta.subtipo3.idSubTipo == idSubtipo) {
          return true
        } else {
          return false;
        }
      } else {
        if(carta.subtipo && carta.subtipo3) {
          if(carta.subtipo.idSubTipo == idSubtipo || carta.subtipo3.idSubTipo == idSubtipo) {
            return true
          } else {
            return false;
          }
        } else {
          if(carta.subtipo && carta.subtipo2) {
            if(carta.subtipo.idSubTipo == idSubtipo || carta.subtipo2.idSubTipo == idSubtipo) {
              return true
            } else {
              return false;
            }
          } else {
            if(carta.subtipo) {
              if(carta.subtipo.idSubTipo == idSubtipo) {
                return true
              } else {
                return false;
              }
            }
            if(carta.subtipo2) {
              if(carta.subtipo2.idSubTipo == idSubtipo) {
                return true
              } else {
                return false;
              }
            }
            if(carta.subtipo3) {
              if(carta.subtipo3.idSubTipo == idSubtipo) {
                return true
              } else {
                return false;
              }
            } else {
              return false;
            }
          }
        }
      }
    }

  }

  obtenerCartas() {
    this.conexion.getTodasLasCartasOrdenadas().subscribe((dato) => {
      this.cartas = dato;
      this.costes = this.getUniqueCostesCartas(this.cartas);
      this.costes = this.costes.sort((a, b) => b - a);
    });
  }

  getUniqueCostesCartas(cartas: Carta[]): number[] {
    let costes: number[] = cartas.map((carta) => carta.costeCarta);
    let uniqueCostes: number[] = [...new Set(costes)];
    return uniqueCostes;
  }

  obtenerDecklists() {
    this.conexion.getTodasLasDecklists().subscribe((dato) => {
      this.decklists = dato;
    });
  }

  getCartasUnicas(lista: Carta[]): Carta[] {
    return lista.filter(
      (carta, i, self) =>
        i === self.findIndex((c) => c.nombreCarta === carta.nombreCarta)
    );
  }

  getCantidad(carta: Carta, lista: Carta[]): number {
    return lista.filter((c) => c.nombreCarta === carta.nombreCarta).length;
  }

  agregarCarta(carta: Carta) {
    if (this.banderaLista) {
      if (carta.tipo.nombreTipo == 'TESORO') {
        const cantidadPrincipal = this.getCantidad(carta, this.boveda);
        const cantidadSide = this.getCantidad(carta, this.sidedeck);
        if (cantidadPrincipal + cantidadSide > 0) {
          Swal.fire({
            icon: 'error',
            title: 'No tan rápido, general',
            text: 'No puedes agregar a tu Bóveda más de 1 copia del mismo Tesoro!',
            background: '#2e3031',
            color: '#fff',
          });
          return;
        }

        this.boveda.push(carta);
        this.boveda.sort((a, b) => {
          if (a.nombreCarta < b.nombreCarta) {
            return -1;
          }
          if (a.nombreCarta > b.nombreCarta) {
            return 1;
          }
          return 0;
        });
      } else {
        const cantidadPrincipal = this.getCantidad(carta, this.reino);
        const cantidadSide = this.getCantidad(carta, this.sidedeck);
        if (cantidadPrincipal + cantidadSide > 3) {
          Swal.fire({
            icon: 'error',
            title: 'No tan rápido, general',
            text: 'No puedes agregar a tu Reino más de 4 copias de la misma carta!',
            background: '#2e3031',
            color: '#fff',
          });
          return;
        }

        this.reino.push(carta);
        this.reino.sort((a, b) => {
          if (a.nombreCarta < b.nombreCarta) {
            return -1;
          }
          if (a.nombreCarta > b.nombreCarta) {
            return 1;
          }
          return 0;
        });
      }
    } else {
      if (
        carta.tipo.nombreTipo == 'TESORO'
      ) {
        const cantidadPrincipal = this.getCantidad(carta, this.boveda);
        const cantidadSide = this.getCantidad(carta, this.sidedeck);
        if (cantidadPrincipal + cantidadSide > 0) {
          Swal.fire({
            icon: 'error',
            title: 'No tan rápido, general',
            text: 'No puedes agregar a tu Side Deck más de 1 copia del mismo Tesoro!',
            background: '#2e3031',
            color: '#fff',
          });
          return;
        }

      } else if (carta.tipo.nombreTipo != 'TESORO') {
        const cantidadPrincipal = this.getCantidad(carta, this.reino);
        const cantidadSide = this.getCantidad(carta, this.sidedeck);

        if (cantidadPrincipal + cantidadSide > 3) {
          Swal.fire({
            icon: 'error',
            title: 'No tan rápido, general',
            text: 'No puedes agregar a tu Reino más de 4 copias de la misma carta!',
            background: '#2e3031',
            color: '#fff',
          });
          return;
        }
      }

      this.sidedeck.push(carta);
      this.sidedeck.sort((a, b) => {
        if (a.nombreCarta < b.nombreCarta) {
          return -1;
        }
        if (a.nombreCarta > b.nombreCarta) {
          return 1;
        }
        return 0;
      });
    }
  }

  eliminarCarta(carta: Carta, lista: Carta[]) {
    const index = lista.findIndex((item) => item === carta);
    if (index !== -1) {
      lista.splice(index, 1);
    }
  }

  getTotalCartas(lista: Carta[]) {
    return lista.length;
  }

  switchearEntreMainAndSidedeck() {
    this.banderaLista = !this.banderaLista;

    if (this.banderaLista) {
      Swal.fire({
        icon: 'info',
        title: 'Cambiando!',
        text: 'Ahora las cartas que clickees estarás agregandolas a tu mazo principal',
        background: '#2e3031',
        color: '#fff',
      });
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Cambiando!',
        text: 'Ahora las cartas que clickees estarás agregandolas a tu Side Deck',
        background: '#2e3031',
        color: '#fff',
      });
    }
  }

  guardarDecklist() {

    let sagrados: number = 0;

    for (const item of this.boveda) {
        if (item.subtipo.nombreSubTipo === 'TESORO - SAGRADO' || item.subtipo2.nombreSubTipo === 'TESORO - SAGRADO' || item.subtipo3.nombreSubTipo === 'TESORO - SAGRADO') {
            sagrados++;
        }
    }

    if (sagrados > 3) {
        Swal.fire({
            icon: 'error',
            title: 'La cantidad de cartas está mal!',
            text: 'No puedes tener más de 3 tesoros sagrados en tu bóveda.',
            background: '#2e3031',
            color: '#fff',
        });
        return;
    }

    if (this.reino.length < 45 || this.reino.length > 60 || this.boveda.length != 15 || this.sidedeck.length != 10) {
      Swal.fire({
        icon: 'error',
        title: 'La cantidad de cartas está mal!',
        text: 'Ten en cuenta que tu reino debe tener mínimo 45 cartas, máximo 60 cartas. Tu bóveda es de 15 cartas, y tu sidedeck es de 10 cartas.',
        background: '#2e3031',
        color: '#fff',
      });
      return;
    }

    let deck: Decklist = new Decklist();
    deck.reino = [];
    deck.boveda = [];
    deck.sidedeck = [];
    deck.fechaDecklist = new Date();

    this.reino.forEach((element) => {
      let deckListCarta: DeckListCarta = new DeckListCarta();
      deckListCarta.carta = element;
      deckListCarta.tipo = 'reino';
      deck.reino.push(deckListCarta);
    });

    this.boveda.forEach((element) => {
      let deckListCarta: DeckListCarta = new DeckListCarta();
      deckListCarta.carta = element;
      deckListCarta.tipo = 'boveda';
      deck.boveda.push(deckListCarta);
    });

    this.sidedeck.forEach((element) => {
      let deckListCarta: DeckListCarta = new DeckListCarta();
      deckListCarta.carta = element;
      deckListCarta.tipo = 'sidedeck';
      deck.sidedeck.push(deckListCarta);
    });

    Swal.fire({
      title:
        'Guarda la URL de la imagen que quieres como portada para tu decklist (recomendamos usar un uploader de imagen como https://postimages.org',
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
        deck.portadaDecklist = result.value;
        Swal.fire({
          title: 'Pon un nombre para tu decklist)',
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
            deck.nombreDecklist = result.value;
            this.conexion.getUsuarioActual().subscribe((usuario: Usuario) => {
              if (!this.banderaEdicion) {
                this.conexion.crearDecklistJugador(deck, usuario.id).subscribe(
                  (dato) => {
                    Swal.fire({
                      icon: 'success',
                      title: 'Guardado!',
                      text: `Tu decklist ${result.value} ha sido guardada.`,
                      background: '#2e3031',
                      color: '#fff',
                    });
                  },
                  (error) => {
                    Swal.fire({
                      icon: 'error',
                      title: 'Error!',
                      text: 'Algo salió mal',
                      background: '#2e3031',
                      color: '#fff',
                    });
                  }
                );
              } else {
                this.conexion.putDecklist(this.decklistId, deck).subscribe(
                  (dato) => {
                    Swal.fire({
                      icon: 'success',
                      title: 'Guardado!',
                      text: `Tu decklist ${result.value} ha sido actualizada.`,
                      background: '#2e3031',
                      color: '#fff',
                    });
                  },
                  (error) => {
                    Swal.fire({
                      icon: 'error',
                      title: 'Error!',
                      text: 'Algo salió mal',
                      background: '#2e3031',
                      color: '#fff',
                    });
                  }
                );
              }
            });
          }
        });
      }
    });
  }

  copyToClipboard() {
    let str = 'Reino: (total: ' + this.getTotalCartas(this.reino) + ')\n';
    this.getCartasUnicas(this.reino).forEach((carta) => {
      str +=
        carta.nombreCarta + ' x' + this.getCantidad(carta, this.reino) + '\n';
    });

    str += `\n Bóveda: (total: ${this.getTotalCartas(this.boveda)}) \n`;
    this.getCartasUnicas(this.boveda).forEach((carta) => {
      str +=
        carta.nombreCarta + ' x' + this.getCantidad(carta, this.boveda) + '\n';
    });

    str += `\n Side Deck: (total: ${this.getTotalCartas(this.sidedeck)}) \n`;
    this.getCartasUnicas(this.sidedeck).forEach((carta) => {
      str +=
        carta.nombreCarta +
        ' x' +
        this.getCantidad(carta, this.sidedeck) +
        '\n';
    });

    navigator.clipboard.writeText(str).then(
      function () {
        Swal.fire({
          icon: 'success',
          title: 'Copiado!',
          text: 'Ya tienes toda la lista copiada en tu portapapeles!',
          background: '#2e3031',
          color: '#fff',
        });
      },
      function (err) {
        Swal.fire({
          icon: 'error',
          title: 'Esto es culpa del rey!',
          text: 'Algo salió mal, no se pudo copiar la lista',
          background: '#2e3031',
          color: '#fff',
        });
      }
    );
  }

  onImageLoad(event: Event) {
    const imageElement = event.target as HTMLImageElement;
    const elementRef = new ElementRef(imageElement);
    elementRef.nativeElement.classList.add('fade-in');
  }
}
