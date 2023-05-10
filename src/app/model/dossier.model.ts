import {UserModel} from "./user.model";
import {EStatutDossier} from "./EStatutDossier";
import {TypeFiles} from "./type-files";

export interface DossierModel {
  id?: number,
  uploadingFile: string
  name: string,
  typeFile : TypeFiles,
  acces : UserModel,
  commentaire ?: string,
  statut : EStatutDossier,
}
