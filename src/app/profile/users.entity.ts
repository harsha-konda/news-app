export class Users{

  user: string;
  subscription:string[];
  comments:string[];
  favorites:string[];

  constructor(user:string){
    this.user=user;
    this.subscription=[];
    this.comments=[];
    this.favorites=[];

  }
}
