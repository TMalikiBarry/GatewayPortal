import { Injectable } from '@angular/core';
import {BehaviorSubject, map, Observable, of, tap} from "rxjs";
import {UserService} from "../UserService/user.service";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment.prod";
import {LoginModel} from "../../model/login.model";
import {ApiResponse} from "../../request/ApiResponse";
import {ResetRequest} from "../../request/ResetRequest";
import {UserModel} from "../../model/user.model";
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuth : boolean = false
  roleAs !: string | null
  role !: string;
  private currentUserSubject!: BehaviorSubject<LoginModel>;
  public currentUser!: Observable<LoginModel>;

  constructor(private http : HttpClient, private loginService : UserService, private router : Router) {
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
          localStorage.setItem('ROLE', this.getTheRole(user.roles));
          localStorage.setItem('TOKEN', user.accessToken)
          this.isAuth = true;
          this.currentUserSubject.next(user);
        }
        return user;
      }));
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
    return this.currentUserValue.id;
  }

  public logout() : Observable<boolean>{
    this.isAuth = false;
    this.roleAs = '';
    localStorage.removeItem("currentUser");
    localStorage.setItem('STATE', 'false');
    localStorage.setItem('ROLE', '');
    localStorage.setItem('TOKEN','')
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
        let utilisateur = user as LoginModel
        this.loginService.getUser(utilisateur.id).pipe(
          tap(console.dir),
          map(res => res.data as UserModel),
          tap(user1 => {
            user = user1;
          })
        ).subscribe();
        if(!user.rememberMe){
          this.router.navigateByUrl('reset');
        }else{
          this.router.navigateByUrl('/admin/dashboard');
        }
      }else{
        this.router.navigateByUrl('/login');
      }
    }
  }

  public getTheRole(roles : [string]) : string{
    if(roles.indexOf("COMMERCANT") !== -1){
      return this.role = "COMMERCANT"
    }else if(roles.indexOf("SUPERVISEUR") !== -1){
      return this.role = "SUPERVISEUR"
    }
    return this.role = "";
  }
}
