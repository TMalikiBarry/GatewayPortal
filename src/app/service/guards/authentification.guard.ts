import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from "../authService/auth.service";
import {DialogAlertComponent} from "../../dialog/SnackBar/dialog-alert.component";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class AuthentificationGuard implements CanActivate {
  constructor(private authService : AuthService, private router : Router, private _snackBar : MatSnackBar) {
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let url = state.url
    return this.checkUserLogin(route, url);
  }

  checkUserLogin(route: ActivatedRouteSnapshot, url: any): boolean {
    if (this.authService.isLoggedIn()) {
      const userRole = this.getTheRole(localStorage.getItem('ROLE')?.toString());
      if (route.data['roles'] && route.data['roles'].indexOf(userRole) === -1) {
        console.log(route.data['roles'])
        console.log(route.data['roles'].indexOf(userRole))
        this._snackBar.openFromComponent(DialogAlertComponent, {
          data: "Accès non autorisé",
          duration: 5000,
          verticalPosition: "top",
          horizontalPosition: "end",
          panelClass: ["custom-style-delete"]
        })
        this.router.navigate(['/login']);
        return false;
      }
      // check si dossier valider
      if(localStorage.getItem('DOSS') === 'false'){
        this.authService.logout();
        this._snackBar.openFromComponent(DialogAlertComponent, {
          data: `Veillez contacter l'administrateur pour vous connecter`,
          duration: 5000,
          verticalPosition: "top",
          horizontalPosition: "end",
          panelClass: ["custom-style-info"]
        })
        this.router.navigate(['/login']);
        return false;
      }
      return true;
    }
    this.router.navigate(['']);
    return false;
  }

  public getTheRole(roles ?: string ) : string {
    switch (roles){
      case "COMMERCANT":
        roles = "COMMERCANT"
        break;
      case "SUPERVISEUR" :
        roles = "SUPERVISEUR"
        break;
      default :
        roles = "";
    }
    return roles
  }

}
