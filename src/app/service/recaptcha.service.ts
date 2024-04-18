import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecaptchaService {

  constructor() { }

  executeRecaptcha(action: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      grecaptcha.ready(() => {
        grecaptcha.execute('6LcefLopAAAAAFN8sPSYSBNigqA22tCUW1O1JC49', { action: action })
          .then((token: string) => {
            resolve(token);
          }, (error: any) => {
            reject(error);
          });
      });
    });
  }

}
