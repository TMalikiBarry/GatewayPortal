import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ApiResponse} from "../../request/ApiResponse";

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  readonly API_URL = environment.API_URL

  readonly ENDPOINT_TRANSACTION = "/transactions/"

  constructor(private http : HttpClient) { }

  postTransaction(data :  any){
    return this.http.post<ApiResponse>(this.API_URL+this.ENDPOINT_TRANSACTION+"new/", data)
  }

  getTransaction(id : number){
    return this.http.get<ApiResponse>(this.API_URL+this.ENDPOINT_TRANSACTION+id)
  }

  getAllTransaction(){
    return this.http.get<ApiResponse>(this.API_URL+this.ENDPOINT_TRANSACTION+"all")
  }

  putTransaction(data : any, id : number){
    return this.http.put<ApiResponse>(this.API_URL+this.ENDPOINT_TRANSACTION+"edit/"+id, data)
  }

  deleteTransaction(id : number){
    return this.http.delete<ApiResponse>(this.API_URL+this.ENDPOINT_TRANSACTION+"delete/"+id)
  }

}
