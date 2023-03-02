import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {AuthService} from "../service/authService/auth.service";
import {DialogAlertComponent} from "../dialog/SnackBar/dialog-alert.component";
import {Injectable} from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthService, private _snackBar: MatSnackBar) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {

      if (err.error instanceof ErrorEvent) {
        // Get client-side error
        console.log(err.error.message);
      } else {
        // Get server-side error
        console.log(`Error Code: ${err.status}\nMessage: ${err.message}`)
      }

      if (err.status === 0) {
        this._snackBar.openFromComponent(DialogAlertComponent, {
          data: "Problème de connextion au serveur",
          duration: 5000,
          verticalPosition: "top",
          horizontalPosition: "end",
          panelClass: ["custom-style-delete"]
        });
      }

      if ([401, 403].indexOf(err.status) !== -1) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        if (this.authenticationService.isAuth) {
          this.authenticationService.logout();
          location.reload();
          this._snackBar.openFromComponent(DialogAlertComponent, {
            data: "Connexion expiree",
            duration: 3000,
            verticalPosition: "top",
            horizontalPosition: "end",
            panelClass: ["custom-style-delete"]
          })
        }
      }
      if ([500].indexOf(err.status) !== -1) {
        this._snackBar.openFromComponent(DialogAlertComponent, {
          data: "Erreur SERVEUR",
          duration: 5000,
          verticalPosition: "top",
          horizontalPosition: "end",
          panelClass: ["custom-style-delete"]
        })
      }
      if ([404].indexOf(err.status) !== -1) {
        this._snackBar.openFromComponent(DialogAlertComponent, {
          data: "Introuvable",
          duration: 5000,
          verticalPosition: "top",
          horizontalPosition: "end",
          panelClass: ["custom-style-delete"]
        })
      }
      if ([400].indexOf(err.status) !== -1) {
        this._snackBar.openFromComponent(DialogAlertComponent, {
          data: "Une erreur est survenue",
          duration: 5000,
          verticalPosition: "top",
          horizontalPosition: "end",
          panelClass: ["custom-style-delete"]
        })
      }

      const error = err.error.message || err.statusText;
      return throwError(error);
    }))
  }
}
