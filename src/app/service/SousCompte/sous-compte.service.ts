import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SousCompteModel} from "../../model/sousCompte.model";
import {environment} from "../../../environments/environment.prod";
import {ApiResponse} from "../../request/ApiResponse";
import {UserModel} from "../../model/user.model";

@Injectable({
  providedIn: 'root'
})
export class SousCompteService {
  myId: number = (<UserModel>JSON.parse(localStorage.getItem('currentUser')!)).id;

  private myEnv: string = environment.API_URL + '/scompte';
  constructor(private http: HttpClient) { }

  addSCompte(newScompte: SousCompteModel) {
    return this.http.post<ApiResponse>(`${this.myEnv}/new`,newScompte);
  }

  getMyCompte() {
    return this.http.get<ApiResponse>(`${environment.API_URL}/compte/commercant/${this.myId}`);
  }

  getMySousReseaux(){
    return this.http.get<ApiResponse>(`${environment.API_URL}/scompte/commercant/${this.myId}`)
  }

  getMyPoints() {
    return this.http.get<ApiResponse>(`${environment.API_URL}/points/commercant/${this.myId}`)
  }

  getMyAgents() {
    return this.http.get<ApiResponse>(`${environment.API_URL}/users/${this.myId}`)
  }

  updateSCompte(updatedScompte: SousCompteModel){
    return this.http.put<ApiResponse>(`${this.myEnv}/edit/${updatedScompte.id}`,updatedScompte);
  }

  deleteSCompte(id: number){
    return this.http.delete<ApiResponse>(`${this.myEnv}/delete/${id}`);
  }

  getOneById(id: number) {
    return this.http.get<ApiResponse>(`${this.myEnv}/${id}`);
  }
  getMySousComptes(){
    return this.http.get<ApiResponse>(`${this.myEnv}/commercant/${this.myId}`);
  }
}
