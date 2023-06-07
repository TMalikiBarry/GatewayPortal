import {CompteModel} from "./compte.model";

export interface ReseauModel {
  id : number
  code : string;
  name : string;
  compte: CompteModel;
}
