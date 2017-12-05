export class Users{

  user: string;
  subscription:string[];
  comments:string[];
  favorites:string[];
  heart:string[];
  tags: any;
  session: {};
  constructor(user:string){
    this.user=user;
    this.subscription=[];
    this.comments=[];
    this.favorites=[];
    this.heart=[];
    this.tags={};
    this.session={};
  }
}

export class Tag{
  id: string
  tag: string[];
  constructor(id:string,tag:string[]){
    this.id=id;
    this.tag=tag;
  }
}

export class TagEntity{
  id: string;
  tag: string[];

  constructor(id:string,tag:string[]){
    this.id=id;
    this.tag=tag;
  }
}

export class HeartEntity{
  id: string;
  selected: boolean;

  constructor(id:string,selected:boolean){
    this.id=id;
    this.selected=selected;
  }
}
