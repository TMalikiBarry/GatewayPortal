import {SousCompteModel} from "./sousCompte.model";
import {UserModel} from "./user.model";

export interface PointsInterface {
  id: number;
  name: string;
  longitude: string;
  latitude: string;
  scompte: SousCompteModel;
  acces: UserModel;
}
