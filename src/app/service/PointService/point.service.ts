import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserModel} from "../../model/user.model";
import {environment} from "../../../environments/environment.prod";
import {ApiResponse} from "../../request/ApiResponse";
import {PointsInterface} from "../../model/points.interface";

@Injectable({
  providedIn: 'root'
})
export class PointService {
  myId: number = (<UserModel>JSON.parse(localStorage.getItem('currentUser')!)).id;

  private myEnv: string = environment.API_URL + '/points';
  constructor(private http: HttpClient) { }

  addPoint(newPoint: PointsInterface) {
    return this.http.post<ApiResponse>(`${this.myEnv}/new`,newPoint);
  }

  getSuperviseurSCompte() {
    return this.http.get<ApiResponse>(`${environment.API_URL}/scompte/superviseur/${this.myId}`);
  }

  getMyPoints() {
    return this.http.get<ApiResponse>(`${this.myEnv}/commercant/${this.myId}`)
  }

  getMyAgents() {
    return this.http.get<ApiResponse>(`${environment.API_URL}/users/${this.myId}`)
  }

  updatePoint(updatedPoint: PointsInterface){
    return this.http.put<ApiResponse>(`${this.myEnv}/edit/${updatedPoint.id}`,updatedPoint);
  }

  deletePoint(id: number){
    return this.http.delete<ApiResponse>(`${this.myEnv}/delete/${id}`);
  }

  getOneById(id: number) {
    return this.http.get<ApiResponse>(`${this.myEnv}/${id}`);
  }
  getMySousComptes(){
    return this.http.get<ApiResponse>(`${environment.API_URL}/scompte/commercant/${this.myId}`);
  }
}
