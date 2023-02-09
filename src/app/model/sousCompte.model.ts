import {CompteModel} from "./compte.model";

export interface SousCompteModel{
  id : number
  sousCompteName : string
  compte ?: CompteModel
}
