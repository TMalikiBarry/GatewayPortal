import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment.prod";
import {HttpClient} from "@angular/common/http";
import {ApiResponse} from "../../request/ApiResponse";

@Injectable({
  providedIn: 'root'
})
export class ApprovisionnementService {

  readonly API_URL = environment.API_URL
  readonly ENDPOINT = "/demandeAppro/"
  constructor(private http : HttpClient) { }

  postAppro(data : any){
    return this.http.post<ApiResponse>(this.API_URL+this.ENDPOINT+"new/", data);
  }

  getAppro(id : number){
    return this.http.get<ApiResponse>(this.API_URL+this.ENDPOINT+"compte/"+id);
  }

}
