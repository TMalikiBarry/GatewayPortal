import {SousCompteModel} from "./sousCompte.model";

export interface PointsInterface {
  id: number;
  name: string;
  longitude: string;
  latitude: string;
  scompte: SousCompteModel;
}
