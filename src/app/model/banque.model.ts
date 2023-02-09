import {RegleModel} from "./regle.model";

export interface BanqueModel {
  id : number,
  code : string;
  bankName : string;
  address : string;
  email : string;
  number1 : string,
  number2 : string,
  numberFax : string,
  regles : RegleModel[];
}
