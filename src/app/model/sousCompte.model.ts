import {CompteModel} from "./compte.model";
import {SousReseauInterface} from "./sous-reseau.interface";
import {UserModel} from "./user.model";
import {PointsInterface} from "./points.interface";

export interface SousCompteModel{
  id: number;
  sousCompteName: string;
  compte?: CompteModel;
  sreseau: SousReseauInterface;
  accesCollection: UserModel[];
  points: PointsInterface[];
}
