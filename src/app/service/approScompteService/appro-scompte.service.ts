import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment.prod";
import {HttpClient} from "@angular/common/http";
import {ApiResponse} from "../../request/ApiResponse";

@Injectable({
  providedIn: 'root'
})
export class ApproScompteService {

  readonly API_URL = environment.API_URL
  readonly END_POINT = "/approScompte/"

  constructor(private http : HttpClient) { }

  postApproScompte(data: any){
    return this.http.post<ApiResponse>(this.API_URL+this.END_POINT+"new/", data)
  }

  getAllApproScompte(){
    return this.http.get<ApiResponse>(this.API_URL+this.END_POINT+"all")
  }

  getApproScompte(id : number){
    return this.http.get<ApiResponse>(this.API_URL+this.END_POINT+id)
  }

  getApproScomteByScompteId(id : number){
    return this.http.get<ApiResponse>(this.API_URL+this.END_POINT+"scompte/"+id)
  }
}
