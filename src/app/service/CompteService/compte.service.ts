import { Injectable } from '@angular/core';
import {UserModel} from "../../model/user.model";
import {environment} from "../../../environments/environment.prod";
import {HttpClient} from "@angular/common/http";
import {ApiResponse} from "../../request/ApiResponse";

@Injectable({
  providedIn: 'root'
})
export class CompteService {
  myId: number = (<UserModel>JSON.parse(localStorage.getItem('currentUser')!)).id;

  //private myEnv: string = environment.API_URL + '/compte';
  constructor(private http: HttpClient) { }
  getMyCompte() {
    return this.http.get<ApiResponse>(`${environment.API_URL}/compte/${this.myId}`);
  }
}
