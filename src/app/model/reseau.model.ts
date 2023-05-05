import {CompteModel} from "./compte.model";
import {SousReseauInterface} from "./sous-reseau.interface";

export interface ReseauModel {
  id : number
  code : string;
  name : string;
  Sreseau : SousReseauInterface[];
  compte: CompteModel;
}
