import {Categorie} from "../admin/parametre/reseaux/categorie-data";

export interface ReseauModel {
  id : number
  code : string;
  name : string;
  categorie : Categorie;
}
