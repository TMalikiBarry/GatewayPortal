import { Injectable } from '@angular/core';
import {BehaviorSubject, map, Observable, of} from "rxjs";
import {UserService} from "../UserService/user.service";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment.prod";
import {LoginModel} from "../../model/login.model";
import {ApiResponse} from "../../request/ApiResponse";
import {ResetRequest} from "../../request/ResetRequest";
import {UserModel} from "../../model/user.model";
import {DossierService} from "../DossierService/dossier.service";
import {DossierModel} from "../../model/dossier.model";
import {CompteService} from "../CompteService/compte.service";
import {CompteModel} from "../../model/compte.model";
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuth : boolean = false
  roleAs !: string | null
  role !: string;
  dossiers !: DossierModel[]
  Compte !: CompteModel;
  utilisateur !: UserModel;
  private currentUserSubject!: BehaviorSubject<LoginModel>;
  public currentUser!: Observable<LoginModel>;

  constructor(private http : HttpClient, private loginService : UserService, private router : Router, private apiDossier : DossierService, private apiCompte : CompteService,) {
    this.currentUserSubject = new BehaviorSubject<LoginModel>(JSON.parse(<string>localStorage.getItem("currentUser")));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() : LoginModel{
    return this.currentUserSubject.value;
  }

  public login(username: string, password: string) {
    return this.http.post<LoginModel>(`${environment.API_URL}/login`, { username, password })
      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        if (user && user.accessToken) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('STATE', 'true');
          localStorage.setItem('DOSS', 'true');
          localStorage.setItem('ROLE', user.roles);
          localStorage.setItem('TOKEN', user.accessToken)
          this.isAuth = true;
          this.currentUserSubject.next(user);
        }
        this.apiDossier.DossierbyId(user.id).subscribe({
          next : value => {
            this.dossiers = value.data as DossierModel[]
            if (this.dossiers.length > 0){
              this.dossiers.forEach(dossier => {
                if(dossier.statut !== 'VALIDER'){
                  localStorage.setItem('DOSS','false')
                  console.log(dossier.name +" est "+dossier.statut)
                }
              })
            }else {
              localStorage.setItem('DOSS','false')
              console.log("pas de dossier pour ce commercant "+user.username)
            }
          }
        })
        this.loginService.getUser(user.id).subscribe({
          next : value => {
            console.log("utilisateur "+JSON.stringify(value.data))
            this.utilisateur = value.data as unknown as UserModel
            localStorage.setItem('utilisateur', JSON.stringify(this.utilisateur))
          }
        })
        return user;
      }));
  }

  public getCompteCommercant(){
    this.currentUserValue.roles
    if(this.currentUserValue.roles === 'SUPERVISEUR'){
      this.loginService.getUser(this.currentUserValue.id).subscribe({
        next : value => {
          let superviseur = value.data as unknown as UserModel
          this.loginService.getUser(superviseur.idParent).subscribe({
            next : value1 => {
              let commercant = value1.data as unknown as UserModel
              this.apiCompte.getMyCompte(commercant.id).subscribe({
                next : value2 => {
                  console.log(value2.data)
                  return value2.data as unknown as CompteModel
                }
              })
            }
          })
        }
      })
    }else{
      this.apiCompte.getMyCompte(this.currentUserValue.id).subscribe({
        next : value => {
          console.log(value.data)
          return value.data as unknown as CompteModel
        }
      })
    }
  }
  public AuthentificateUser( login : LoginModel): Observable<boolean>{
    this.currentUserSubject.next(login);
    this.isAuth = true;
    return of(true);
  }

  public hasRole( roles : string ): boolean {
    return this.currentUserSubject.getValue()!.roles.includes(roles);
  }

  public forgot( request: ResetRequest) {
    return this.http.post<ApiResponse>(`${environment.API_URL}/forgot`, request)
      .pipe(map(user => {
        return user;
      }));
  }

  public confirm( token : String) {
    return this.http.post<ApiResponse>(`${environment.API_URL}/confirm`, token )
      .pipe(map(user => {
        return user;
      }));
  }

  public reset(id: number | undefined, token: string | null, password: string , oldPassword: string | null, confirm: string) {
    return this.http.post<ApiResponse>(`${environment.API_URL}/reset`, { id, token ,password, oldPassword, confirm })
      .pipe(map(user => {
        return user;
      }));
  }

  public isAuthentificated():boolean{
    this.isAuth = this.currentUser != null;
    return this.isAuth;
  }

  public getId() {
    return this.currentUserValue.id
  }

  public logout() : Observable<boolean>{
    this.isAuth = false;
    this.roleAs = '';
    localStorage.clear()
    return of(true);
  }

  getRole() {
    this.roleAs = localStorage.getItem('ROLE');
    return this.roleAs;
  }

  isLoggedIn() {
    const loggedIn = localStorage.getItem('STATE');
    this.isAuth = loggedIn == 'true';
    return this.isAuth;
  }

  routingAlreadyConnectedApp(){
    // console.log('babs');
    if (localStorage.getItem('currentUser')) {
      let user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if(user){
        this.AuthentificateUser(user);
        this.isAuth = true;
        // this.loginService.getUser(utilisateur.id).pipe(
        //   tap(console.dir),
        //   map(res => res.data as UserModel),
        //   tap(user1 => {
        //     user = user1;
        //   })
        // ).subscribe()
        if (localStorage.getItem('DOSS') !== 'true'){
          this.logout();
          return
        }
        console.log(this.utilisateur)
        if(this.utilisateur){
          if(!this.utilisateur.rememberMe){
            console.log("reset")
            this.router.navigateByUrl('reset');
          }
        }else{
          this.router.navigateByUrl('/admin/dashboard');
        }
      }else{
        this.router.navigateByUrl('/login');
      }
    }
  }

  // public getTheRole(roles : [string]) : string{
  //   if(roles.indexOf("COMMERCANT") !== -1){
  //     return this.role = "COMMERCANT"
  //   }else if(roles.indexOf("SUPERVISEUR") !== -1){
  //     return this.role = "SUPERVISEUR"
  //   }
  //   return this.role = "";
  // }
}
