import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
  wish_list: any[];
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

  updateCartCount(count: number) {
    this.cartCount.next(count);
  }

  updateFavCount(count: number) {
    this.favCount.next(count);
  }

  setUserData(data: UserData) {
    this.userData.next(data);
    localStorage.setItem('userData', JSON.stringify(data));
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
