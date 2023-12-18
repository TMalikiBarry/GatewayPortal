import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment.prod";
import {HttpClient} from "@angular/common/http";
import {ApiResponse} from "../../request/ApiResponse";
import {UserModel} from "../../model/user.model";
import {SousReseauInterface} from "../../model/sous-reseau.interface";
import {AuthService} from "../authService/auth.service";

@Injectable({
  providedIn: 'root'
})
export class SousReseauxService {

  private readonly currentEnv = environment.API_URL + '/sreseau'

  public myId: number = (<UserModel>JSON.parse(localStorage.getItem('currentUser')!)).id;

  constructor(private http : HttpClient, private auth : AuthService) {
    if(auth.getRole() === 'SUPERVISEUR')
      this.myId = (<UserModel>JSON.parse(localStorage.getItem('utilisateur')!)).idParent
  }

  postSousReseau(data: SousReseauInterface){
    return this.http.post<ApiResponse>(`${this.currentEnv}/new`, data);
  }

  getMyReseau() {
    return this.http.get<ApiResponse>(`${environment.API_URL + '/reseau'}/commercant/${this.myId}`)
  }

  getSCompteById(id: number) {
    return this.http.get<ApiResponse>(`${environment.API_URL + '/scompte'}/${id}`);
  }

  getMySousComptes(){
    return this.http.get<ApiResponse>(`${environment.API_URL + '/scompte'}/commercant/${this.myId}`);
  }

  getAllMySuperviseurs(){
    return this.http.get<ApiResponse>(`${environment.API_URL + '/users'}/${this.myId}`);
  }
  getMySousReseaux(){
    return this.http.get<ApiResponse>(`${this.currentEnv}/commercant/${this.myId}`)
  }

  putSousReseau(data: SousReseauInterface){
    return this.http.put<ApiResponse>(`${this.currentEnv}/edit/${data.id}`, data);
  }

  deleteSousReseau(id : number){
    return this.http.delete<ApiResponse>(`${this.currentEnv}/delete/${id}`);
  }
}
