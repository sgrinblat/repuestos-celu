// import { Injectable } from '@angular/core';
// import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
// import { Observable } from 'rxjs';


// @Injectable({
//   providedIn: 'root'
// })
// export class AdminGuard implements CanActivate {

//   constructor( private router:Router){

//   }

//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
//     if(this.conexion.sesionIniciadaAdmin()){
//       return true;
//     }

//     this.router.navigate(['v1/login']);
//     return false;
//   }

// }
