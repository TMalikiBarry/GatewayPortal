import {ReseauModel} from "./reseau.model";
import {SousCompteModel} from "./sousCompte.model";
import {UserModel} from "./user.model";

export interface SousReseauInterface {
  id?: number;
  sousReseauName: string;
  code?: string;
  reseau: ReseauModel;
  acces: UserModel;
  scomptes?: SousCompteModel[];
}
