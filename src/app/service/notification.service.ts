import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConexionService } from './conexion.service';

interface UserData {
  cel_phone: string;
  cel_phone_complete: string;
  city_id: number;
  city_name: string;
  code_area: string;
  email: string;
  id: number;
  image: string | null;
  name: string;
  shop_cart: any[];
  state_id: number;
  state_name: string;
  favorite_list: any[];
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private cartCount = new BehaviorSubject<number>(0);
  private favCount = new BehaviorSubject<number>(0);
  private userData = new BehaviorSubject<UserData | null>(null);

  cartCount$ = this.cartCount.asObservable();
  favCount$ = this.favCount.asObservable();
  userData$ = this.userData.asObservable();

  constructor(private conexionService: ConexionService) { }

  updateCartCount(count: number) {
    this.cartCount.next(count);
  }

  updateFavCount(count: number) {
    this.favCount.next(count);
  }

  fetchFavCount() {
    this.conexionService.getFavoriteList().subscribe({
      next: (productos) => {
        // No necesitas verificar si es un array; el servicio ya maneja eso.
        this.updateFavCount(productos.length);  // Directamente usa la longitud del array de productos
      },
      error: (error) => {
        console.error('Error fetching favorite list:', error);
        this.updateFavCount(0);  // Considera resetear el contador si hay un error
      }
    });
  }

  setUserData(data: UserData) {
    this.userData.next(data);
    localStorage.setItem('userData', JSON.stringify(data));

    // Actualizar el contador de favoritos basado en la longitud del array favorite_list
    const favCount = data.favorite_list ? data.favorite_list.length : 0;
    this.updateFavCount(favCount);
  }



  loadUserData() {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      this.userData.next(JSON.parse(storedData));
    }
  }

  updateUserData(newData: Partial<UserData>) {
    const currentData = this.userData.value;
    if (currentData) {
      const updatedData = { ...currentData, ...newData };
      this.userData.next(updatedData);
      localStorage.setItem('userData', JSON.stringify(updatedData));
    }
  }
}
