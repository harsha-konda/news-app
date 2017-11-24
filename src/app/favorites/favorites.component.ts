import {Component, Input, OnInit, Output, OnChanges, EventEmitter} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {Users} from "../profile/users.entity";
import {Post} from "../posts/posts.entity";
import {UsersService} from "../profile/users.service";
import {reject} from "q";
import {NgModel} from '@angular/forms';

@Component({
  selector: 'app-favorites',
  template: `    
    <div class="votebox">
      <span class="fa fa-arrow-up vote up"
        (click)="upvote()"
        [ngClass]="{'active' : userVote==1  }">
      </span>
      <span class="vote-count">{{this.upvotes}}</span>
      <span class="fa fa-arrow-down vote down"
            (click)="downvote()"
            [ngClass]="{'active' : userVote==-1  }">
      </span>
    </div>`,
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {

  @Input() userid: string;
  @Input() postId;
  @Input() upvotes:number;

  voteCount: number = 0;
  userVote: number = 0;


  user;
  us: UsersService;
  auth;
  selected = false;


  @Output() notify: EventEmitter<string> = new EventEmitter<string>();

  constructor(auth: AuthService, us: UsersService) {
    this.us = us;
  }

  ngOnInit() {
    console.log("inti"+this.upvotes);
    this.getUserdata();
  }

  upvote() {
    if(this.userVote==1)
      return;

    this.userVote = this.userVote==-1 ? 0 : 1;
    this.notify.emit(this.postId+":"+this.userVote+":"+(++this.upvotes));
  }

  downvote() {
    if(this.userVote==-1)
      return;

    this.userVote= this.userVote==1? 0 : -1
    this.notify.emit(this.postId+":"+this.userVote+":"+(--this.upvotes));
  }


  getUserdata() {
    this.us
      .getFormData(this.userid)
      .subscribe(data => {
        this.user = data;

        let i=this.user.favorites.indexOf(this.postId+":1");
        i=Math.max(i,this.user.favorites.indexOf(this.postId+":-1"));

        console.log(i);
        if(i>=0)
          this.userVote=this.user.favorites[i].split(":")[1];
      })
  }


}
