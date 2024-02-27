import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {environment} from "../../../environments/environment.prod";
import {ApiResponse} from "../../request/ApiResponse";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  readonly API_URL = environment.API_URL

  readonly ENDPOINT_USER = "/users/"

  constructor(private http : HttpClient) { }

  postUser(data :  any){
    console.log(data)
    return this.http.post<ApiResponse>(this.API_URL+"/user/save", data)
  }

  getUser(id : number){
    return this.http.get<ApiResponse>(this.API_URL+"/user/"+id)
  }

  getAllUser(id : number){
    return this.http.get<ApiResponse>(this.API_URL+this.ENDPOINT_USER+id);
  }

  putUser(data : any, id : number){
    console.log(data)
    return this.http.put<ApiResponse>(this.API_URL+"/user/edit/"+id, data)
  }

  deleteLogin(id : number){
  return this.http.delete<ApiResponse>(this.API_URL+"/user/delete/"+id)
  }

}
