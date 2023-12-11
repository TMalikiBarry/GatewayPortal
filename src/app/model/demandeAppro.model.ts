import {CompteModel} from "./compte.model";
import {DossierModel} from "./dossier.model";
import {EStatutDemande} from "./EStatutDemande";

export interface DemandeApproModel{
  id : number
  dateDemande : Date
  montant : number
  statutDemande : EStatutDemande
  compte : CompteModel
  evidence : DossierModel
}
