import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment.prod";
import {HttpClient} from "@angular/common/http";
import {ApiResponse} from "../../request/ApiResponse";
import {TypeFiles} from "../../model/type-files";

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

  Upload(data: FormData, typeFile : TypeFiles){
    return this.http.post<ApiResponse>(this.API_URL+this.ENDPOINT_DOSSIER+"upload/"+typeFile, data)
  }

  removeFile(fileName: string) {
    return this.http.delete(`${this.API_URL+this.ENDPOINT_DOSSIER}deleteFile/${fileName}`);
  }
}
