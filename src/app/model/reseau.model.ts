import {UserModel} from "./user.model";

export interface ReseauModel {
  id : number
  code : string;
  name : string;
  accesCollection : UserModel[]
}
