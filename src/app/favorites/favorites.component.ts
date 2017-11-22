import {Component, Input, OnInit, Output, OnChanges, EventEmitter} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {Users} from "../profile/users.entity";
import {Post} from "../posts/posts.entity";
import {UsersService} from "../profile/users.service";

@Component({
  selector: 'app-favorites',
  template: `<button class="btn fa fa-heart fa-3" 
                     style="color: red" 
                     aria-hidden="true" 
                     (click)="changeUpvotes()">{{upvotes}}</button>`,
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit,OnChanges {

  @Input() userid:string
  @Input() postId
  @Input()  upvotes
  @Output() updatedUpvotes:number;
  user;
  us:UsersService;
  auth;

  @Output() notify: EventEmitter<number> = new EventEmitter<number>();

  constructor(auth:AuthService,us:UsersService) {
    this.us=us;
  }

  ngOnInit() {
  }
  ngOnChanges(){
  }
  
  changeUpvotes(){

    this.us
      .getFormData(this.userid)
      .subscribe(data=>{
        this.user=data
        var index=this.exists()
        if(index>-1){
          this.user.favorites.splice(index,1);
          this.updatedUpvotes=this.upvotes--;
          this.notify.emit(this.updatedUpvotes);
          this.updateUser();
          return;
        }
        this.user.favorites.push(this.postId);
        this.updatedUpvotes=this.upvotes++;
        this.updateUser();
        this.notify.emit(this.updatedUpvotes);
      });

    return;
  }

  updateUser(){
    this.us
      .updateUser(this.user)
      .subscribe(data=>console.log({btitchL:data}));
  }



  exists(){
    for(var i=0;i<this.user.favorites.length;i++){
      if(this.user.favorites[i]==this.postId)
        return i;
    }
    return -1;
  }



}
