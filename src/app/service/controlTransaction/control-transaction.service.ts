import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ControlTransactionInterface} from "../../model/control-transaction.interface";
import {environment} from "../../../environments/environment.prod";
import {ApiResponse} from "../../request/ApiResponse";

@Injectable({
  providedIn: 'root'
})
export class ControlTransactionService {
  constructor( private http: HttpClient ) { }

  getAControlTransaction(id: number) {
    return this.http.get<ApiResponse>(`${environment.API_URL}/control/${id}`);
  }

  getMyControlTransactions(myID: number) {
    return this.http.get<ApiResponse>(`${environment.API_URL}/control/commercant/${myID}`);
  }

  getPointsById(id:number){
    return this.http.get<ApiResponse>(environment.API_URL+"/scompte/" + id);
  }

  getServiceById(id:number){
    return this.http.get<ApiResponse>(environment.API_URL+"/services/" + id);
  }
  getMyPoints(myId: number) {
    return this.http.get<ApiResponse>(environment.API_URL+"/points/commercant/" + myId);
  }
  getAllService(){
    return this.http.get<ApiResponse>(environment.API_URL+"/services/all")
  }

  createNewControlTransaction(newCTransaction: ControlTransactionInterface) {
    return this.http.post<ApiResponse>(`${environment.API_URL}/control/new`, newCTransaction);
  }

  updateControlTransaction(updatedCTransaction: ControlTransactionInterface, id: number) {
    return this.http.put<ApiResponse>(`${environment.API_URL}/control/edit/${id}`, updatedCTransaction);
  }

  deleteControlTransaction(id: number) {
    return this.http.delete<ApiResponse>(`${environment.API_URL}/control/delete/${id}`);
  }
}
