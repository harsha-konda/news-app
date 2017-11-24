import {Component, OnInit, OnChanges, Input} from '@angular/core';
import { AuthService } from './../auth/auth.service';
import {UsersService} from "../profile/users.service";
import {SearchService} from "../search.service";
import {NgForm} from "@angular/forms";
import {Users} from "../profile/users.entity";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public auth: AuthService,public user:UsersService,public es:SearchService) {
    setInterval(() => { this.esUpdateUser(); }, 1000);
  }

  formattedSubs;
  profileData;
  profile;

  subs=["http://www.cnn.com"];
  User: Users;
  ngOnInit() {

    if (this.auth.userProfile) {
      this.profile = this.auth.userProfile;
      this.getUserData(this.profile.nickname);
      this.formatSubs();
    } else {
      this.auth.getProfile((err, profile) => {
        this.profile = profile;
        if(profile)
          this.getUserData(profile.nickname);
        this.formatSubs();
      });
    }

  }

  updateUser(i,postId) {
    if(i==0) {
      this.User.favorites = this.User.favorites.filter((data) => data.split(":")[0] != postId);
    }else{
      let index=this.User.favorites.indexOf(postId+":1");
      index=Math.max(index,this.User.favorites.indexOf(postId+":1"));
      if(index<0)
        this.User.favorites.push(postId+":"+i);
      else{
        this.User.favorites[index]=postId+":"+i;
      }
    }
  }

  addComment(event){
    this.User.comments.push(event);
  }

  update(event){
    console.log({home:event});
    this.updateUser(event.split(":")[1],event.split(":")[0]);
  }

  esUpdateUser(){
    if(!this.User)
      return;

    delete this.User.subscription;
    this.user.updateUser(this.User).subscribe();
  }

  getUserData(user){
    this.user.getFormData(user).subscribe(data=>{
      this.User=data;
      this.subs=data["subscription"];
      this.formatSubs();
    });
  }

  formatSubs(){
    this.formattedSubs=this.subs.map(a=>
      a.replace("http:\/\/","")
        .replace("\.com","")
        .replace("www\.",""));
  }




}
