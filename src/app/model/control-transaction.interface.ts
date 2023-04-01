import {ServiceModel} from "./service.model";
import {SousCompteModel} from "./sousCompte.model";
import {Time} from "@angular/common";

export interface ControlTransactionInterface {
  id?: number;
  service: ServiceModel;
  sCompte: SousCompteModel;
  montantSeuil: number;
  montantHebdomadaire?: number;
  montantJournalier?: number;
  heureDebut?: Time;
  heureFin?: string;
  isActivated?: boolean;
}
