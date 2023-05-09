import {ServiceModel} from "./service.model";
import {PointsInterface} from "./points.interface";

export interface ControlTransactionInterface {
  id?: number;
  service: ServiceModel;
  points: PointsInterface;
  montantSeuil: number;
  montantHebdomadaire?: number;
  montantJournalier?: number;
  heureDebut?: string;
  heureFin?: string;
  isActivated?: boolean;
}
