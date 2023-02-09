import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ApiResponse} from "../../request/ApiResponse";

@Injectable({
  providedIn: 'root'
})
export class ReseauxService {

  readonly API_URL = environment.API_URL

  readonly ENDPOINT_RESEAUX = "/reseau/"

  constructor(private http : HttpClient) { }

  postReseau(data :  any){
    console.log(data)
    return this.http.post<ApiResponse>(this.API_URL+"/reseau/new/", data)
  }

  postReseauToAcces(data :  any){
    console.log(data)
    return this.http.post<ApiResponse>(this.API_URL+"/reseau/addAccesToReseau", data)
  }

  getReseau(id : number){
    return this.http.get<ApiResponse>(this.API_URL+this.ENDPOINT_RESEAUX+id)
  }

  getAllReseau(id : number){
    return this.http.get<ApiResponse>(this.API_URL+this.ENDPOINT_RESEAUX+"commercant/"+id)
  }

  putReseau(data : any, id : number){
    return this.http.put<ApiResponse>(this.API_URL+"/reseau/edit/"+id, data)
  }

  deleteReseau(id : number){
    return this.http.delete<ApiResponse>(this.API_URL+"/reseau/delete/"+id)
  }
}
