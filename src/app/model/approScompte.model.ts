import {EStatutDemande} from "./EStatutDemande";
import {SousCompteModel} from "./sousCompte.model";

export interface ApproScompteModel{
  id : number
  dateDemande : Date
  montant : number
  statutDemande : EStatutDemande
  scompte ?: SousCompteModel
}
