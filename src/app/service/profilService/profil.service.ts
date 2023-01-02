import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ApiResponse} from "../../request/ApiResponse";

@Injectable({
  providedIn: 'root'
})
export class ProfilService {

  readonly API_URL = environment.API_URL

  readonly ENDPOINT_ROLE = "/roles/"

  constructor(private http : HttpClient) { }

  postRole(data :  any){
    console.log(data)
    return this.http.post<ApiResponse>(this.API_URL+"/role/save/", data)
  }

  getRole(id : number){
    return this.http.get<ApiResponse>(this.API_URL+this.ENDPOINT_ROLE+id)
  }

  getAllRole(){
    return this.http.get<ApiResponse>(this.API_URL+this.ENDPOINT_ROLE)
  }

  putRole(data : any, id : number){
    return this.http.put<ApiResponse>(this.API_URL+"/role/edit/"+id, data)
  }

  deleteRole(id : number){
    return this.http.delete<ApiResponse>(this.API_URL+"/role/delete/"+id)
  }
}
