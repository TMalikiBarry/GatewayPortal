import {ReseauModel} from "./reseau.model";
import {SousCompteModel} from "./sousCompte.model";

export interface SousReseauInterface {
  id?: number;
  sousReseauName: string;
  code?: string;
  reseau: ReseauModel;
  scomptes: SousCompteModel[];
}
