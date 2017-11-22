import {Component, OnInit, OnChanges, Input} from '@angular/core';
import { AuthService } from './../auth/auth.service';
import {UsersService} from "../profile/users.service";
import {SearchService} from "../search.service";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public auth: AuthService,public user:UsersService,public es:SearchService) {}

  formattedSubs;
  profileData;
  profile;

  subs=["http://www.cnn.com"];

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




  getUserData(user){
    this.user.getFormData(user).subscribe(data=>{
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
