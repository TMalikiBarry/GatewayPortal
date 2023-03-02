import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ParamListInterface} from "../../model/param-list.interface";
import {environment} from "../../../environments/environment.prod";
import {ResponsePaymentInterface} from "../../model/response-payment.interface";

@Injectable({
  providedIn: 'root'
})
export class ServiceTransService {
  // xPressCashEndPoint = 'https://dev-touch-ssii-api.gutouch.net/gateway/ecobank/cash'
  constructor(private http: HttpClient) { }

  xPressCashTransaction(paramList: ParamListInterface){
    return this.http.post<ResponsePaymentInterface>(environment.API_URL_ECOBANK+'/cash', paramList);
  }
}
