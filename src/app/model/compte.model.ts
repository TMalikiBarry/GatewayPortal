import {UserModel} from "./user.model";

export interface CompteModel {
  id?: number;
  compteName: string;
  compteNumero: string;
  typeCompte: TypeCompte;
  categorie: Categorie;
  acces: UserModel;
}

export enum TypeCompte {
  EPARGNE = "EPARGNE",
  COURANT = "COURANT",
  A_TERME = "A_TERME",
  INDIVIDUEL = "INDIVIDUEL",
  JOINT = "JOINT",
  INDIVIS = "INDIVIS"
}

export enum Categorie {
  B2B = 'B2B',
  GROSSISTE = 'GROSSISTE',
  INDEPENDANT = 'INDEPENDANT'
}
