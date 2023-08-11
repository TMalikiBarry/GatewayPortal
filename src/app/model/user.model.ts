import {RoleModel} from "./role.model";

export interface UserModel {
  id : number
  name : string;
  username : string;
  number?: string;
  password : string;
  email : string;
  roles ?: RoleModel;
  rememberMe : boolean;
  idParent : number;
}
