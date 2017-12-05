import {Component, OnInit, OnChanges, Input,OnDestroy} from '@angular/core';
import { AuthService } from './../auth/auth.service';
import {UsersService} from "../profile/users.service";
import {SearchService} from "../search.service";
import {NgForm} from "@angular/forms";
import {HeartEntity, TagEntity, Users} from "../profile/users.entity";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit,OnDestroy {

  constructor(public auth: AuthService,public user:UsersService,public es:SearchService) {
    setInterval(() => { this.esUpdateUser();this.mapTags() }, 1000);
  }

  formattedSubs;
  profileData;
  profile;

  subs=["http://www.cnn.com"];
  @Input() User: Users;
  tags;
  session={};
  prevIndex=0;
  time;
  ngOnInit() {
    this.time=(new Date).getTime();
    if(this.auth.isAuthenticated())
      this.fetchData();
  }



  ngOnDestroy(){
    this.esUpdateUser();
  }

  fetchData(){
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

  focusChange(event){
    var newTime=(new Date).getTime();
    if(!this.User.session[this.subs[this.prevIndex]])
      this.User.session[this.subs[this.prevIndex]]=0;

    this.User.session[this.subs[this.prevIndex]]+=Math.round((newTime-this.time)/20000);
    this.time=newTime;
    this.prevIndex=event.index;
  }



  mapTags(){
    var tempTags={}
    if(!this.User || !this.tags)
      return

    let tagKeys=Object.keys(this.User.tags);
    for(var i=0;i<tagKeys.length;i++){
      for(let j of this.User.tags[tagKeys[i]]){
        if(!tempTags[j])
          tempTags[j]=[]
        tempTags[j].push({name:tagKeys[i]});
      }
    }
    this.tags=tempTags;
  }

  updateHeart(state: HeartEntity){
    if(!state.selected)
      this.User.heart=this.User.heart.filter((data)=>data!=state.id);
    else
      this.User.heart.push(state.id);
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

  updateTag(event : TagEntity){
    this.User.tags[event.id]=event.tag;
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

    if(this.auth.isAuthenticated()){
      delete this.User.subscription;
      this.user.updateUser(this.User).subscribe();
    }
  }

  getUserData(user){
    this.user.getFormData(user).subscribe(data=>{
      this.User=data;
      this.subs=data["subscription"];
      this.subs.map((link)=>{
        this.session[link]=0;
      });
      this.formatSubs();
    },err=>{
      this.createUserProfile();
    });
  }

  formatSubs(){
    this.formattedSubs=this.subs.map(a=>
      a.replace("http:\/\/","")
        .replace("\.com","")
        .replace("www\.",""));
  }

  createUserProfile(){
    this.user
      .createUser(new Users(this.profile.nickname))
      .subscribe((data)=>this.getUserData(this.profile.nickname));
  }




}
