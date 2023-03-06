import {ServiceModel} from "./service.model";
import {SousCompteModel} from "./sousCompte.model";

export interface TransactionModel{
  id?: number
  destinataire : string
  montant : number
  commission : number
  statut : StatutTransactionEnum;
  dateTransaction : Date,
  typeTransaction : TypeTransactionEnum;
  service : ServiceModel;
  scompte : SousCompteModel
}
export enum TypeTransactionEnum {
  C_BANCAIRE= 'CARTE_BANCAIRE',
  ESPECE = 'ESPECE',
  VIREMENT = 'VIREMENT',
  T_INTERNE = 'TRANSFERT_INTERNE',
  T_EXTERNE = 'TRANSFERT_EXTERNE',
  R_REMBOURSEMENT = 'RECUPERATION_REMBOURSEMENT',
  DEBIT = 'DEBIT',
  REMBOURSEMENT = 'REMBOURSEMENT',
  TOUCHPOINT = 'TOUCHPOINT',
  CHEQUE = 'CHEQUE',
}

export type TransactionKey = 'C_BANCAIRE' |'ESPECE' |'VIREMENT' |'T_INTERNE' |'T_EXTERNE' |'R_REMBOURSEMENT' |'DEBIT' |'REMBOURSEMENT' |'TOUCHPOINT'|'CHEQUE';



export enum StatutTransactionEnum {
  INITIATED,
  SENT,
  FINISHED,
  SUSPICIOUS
}
