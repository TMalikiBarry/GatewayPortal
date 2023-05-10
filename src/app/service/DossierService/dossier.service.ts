import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment.prod";
import {HttpClient} from "@angular/common/http";
import {ApiResponse} from "../../request/ApiResponse";

@Injectable({
  providedIn: 'root'
})
export class DossierService {

  readonly API_URL = environment.API_URL

  readonly ENDPOINT_DOSSIER = "/dossier/"

  constructor(private http : HttpClient) { }

  DossierbyId(id : number){
    return this.http.get<ApiResponse>(this.API_URL+this.ENDPOINT_DOSSIER+"agentDossiers/"+id)
  }
}
