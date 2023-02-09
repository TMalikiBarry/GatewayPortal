import {BanqueModel} from "./banque.model";
import {RegleModel} from "./regle.model";

export interface ServiceModel {
  id : number
  serviceName : string;
  bank ?: BanqueModel
  regles : RegleModel[]
}
