import {SousCompteModel} from "./sousCompte.model";
import {UserModel} from "./user.model";
import {ControlTransactionInterface} from "./control-transaction.interface";

export interface PointsInterface {
  id: number;
  name: string;
  longitude: string;
  latitude: string;
  scompte: SousCompteModel;
  acces: UserModel;
  controlTransaction ?: ControlTransactionInterface
}
