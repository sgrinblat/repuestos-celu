import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface CurrencyInfo {
    value_avg: number;
    value_sell: number;
    value_buy: number;
}

interface CurrencyResponse {
    oficial: CurrencyInfo;
    blue: CurrencyInfo;
    oficial_euro: CurrencyInfo;
    blue_euro: CurrencyInfo;
    last_update: string;
}

interface CurrencyCripto {
  ask: number;
  totalAsk: number;
  bid: number;
  totalBid: number;
  time: number;
}


@Injectable({
  providedIn: 'root'
})

export class CotizacionService {

  constructor(private httpClient: HttpClient) { }

  getCotizaciones(): Observable<CurrencyResponse> {
    return this.httpClient.get<CurrencyResponse>("https://api.bluelytics.com.ar/v2/latest");
  }

  getCotizacionesCripto(): Observable<CurrencyCripto> {
    return this.httpClient.get<CurrencyCripto>("https://criptoya.com/api/binance/usdt/ars/0.1");
  }


}
