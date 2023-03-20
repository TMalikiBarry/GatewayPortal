import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment.prod";
import {HttpClient} from "@angular/common/http";
import {ApiResponse} from "../../request/ApiResponse";
import {ParamListInterface} from "../../model/param-list.interface";
import {ResponsePaymentInterface} from "../../model/response-payment.interface";
import {TransactionModel} from "../../model/transaction.model";
import {map, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  readonly API_URL = environment.API_URL

  readonly ENDPOINT_TRANSACTION = "/transactions/"

  constructor(private http : HttpClient) { }

  postTransaction(data :  TransactionModel){
    return this.http.post<ApiResponse>(this.API_URL+this.ENDPOINT_TRANSACTION+"new/", data)
  }

  xPressCashTransaction(paramList: ParamListInterface){
    return this.http.post<ApiResponse>(environment.API_URL_ECOBANK+'/cash', paramList).pipe(
      tap(console.dir),
      map(res => res.data as ResponsePaymentInterface),
    );
  }

  getMySousComptes(myId: number) {
    return this.http.get<ApiResponse>(this.API_URL+"/scompte//commercant/" + myId);
  }
  getAllService(){
    return this.http.get<ApiResponse>(this.API_URL+"/services/all")
  }
  getTransaction(id : number){
    return this.http.get<ApiResponse>(this.API_URL+this.ENDPOINT_TRANSACTION+id)
  }

  getAllTransaction(){
    return this.http.get<ApiResponse>(this.API_URL+this.ENDPOINT_TRANSACTION+"all")
  }

  putTransaction(data : TransactionModel, id : number){
    return this.http.put<ApiResponse>(this.API_URL+this.ENDPOINT_TRANSACTION+"edit/"+id, data)
  }

  deleteTransaction(id : number){
    return this.http.delete<ApiResponse>(this.API_URL+this.ENDPOINT_TRANSACTION+"delete/"+id)
  }

}
