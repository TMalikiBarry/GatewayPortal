import {UserModel} from "./user.model";

export interface CompteModel {
  id?: number;
  compteName: string;
  compteNumero: string;
  typeCompte: TypeCompte;
  categorie: Categorie;
  acces: UserModel;
  natureCompte : NatureCompte;
}

export enum TypeCompte {
  EPARGNE = "EPARGNE",
  COURANT = "COURANT",
  A_TERME = "A_TERME",
  INDIVIDUEL = "INDIVIDUEL",
  JOINT = "JOINT",
  INDIVIS = "INDIVIS"
}

export enum NatureCompte{
  MIXTE="MIXTE",
  PRINCIPAL = "PRINCIPAL",
  COMMISSION = "COMMISSION"
}

export enum Categorie {
  B2B = 'B2B',
  GROSSISTE = 'GROSSISTE',
  INDEPENDANT = 'INDEPENDANT'
}
