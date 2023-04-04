import {ServiceModel} from "./service.model";
import {SousCompteModel} from "./sousCompte.model";

export interface ControlTransactionInterface {
  id?: number;
  service: ServiceModel;
  sCompte: SousCompteModel;
  montantSeuil: number;
  montantHebdomadaire?: number;
  montantJournalier?: number;
  heureDebut?: string;
  heureFin?: string;
  isActivated?: boolean;
}
