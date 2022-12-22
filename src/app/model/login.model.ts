export interface LoginModel {
  id : number
  username : string;
  email : string;
  roles : [string];
  tokenType : string;
  accessToken : string
}
