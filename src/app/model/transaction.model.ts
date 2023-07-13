import {ServiceModel} from "./service.model";
import {PointsInterface} from "./points.interface";

export interface TransactionModel{
  id?: number;
  destinataire : string;
  numdestinataire : string;
  transactionid ?: string;
  expeditaire : string;
  numexpeditaire : string;
  montant : number;
  commission ?: number;
  requestId ?: string;
  statut : StatutTransactionEnum;
  dateTransaction ?: Date,
  dateModification ?: Date,
  typeTransaction : TypeTransactionEnum;
  service : ServiceModel;
  points : PointsInterface
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
  SUSPICIOUS,
  SUCCESS,
  FAILED
}
