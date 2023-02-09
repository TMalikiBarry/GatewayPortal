import {ServiceModel} from "./service.model";
import {SousCompteModel} from "./sousCompte.model";
import {StatutTransactionModel} from "./statutTransaction.model";
import {TypeTransactionModel} from "./typeTransaction.model";

export interface TransactionModel{
  id : number
  destinataire : string
  montant : number
  commission : number
  statut : StatutTransactionModel;
  dateTransaction : Date,
  typeTransaction : TypeTransactionModel;
  service ?: ServiceModel;
  scompte ?: SousCompteModel
}
