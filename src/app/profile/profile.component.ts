import { Component, OnInit } from '@angular/core';
import { AuthService } from './../auth/auth.service';
import {UsersService} from "./users.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profile: any;
  profileData: any;

  constructor(public auth: AuthService,public user:UsersService) { }

  showFullData=false;
  ngOnInit() {
    if (this.auth.userProfile) {
      this.profile = this.auth.userProfile;
    } else {
      this.auth.getProfile((err, profile) => {
        this.profile = profile;
        this.getUserProfile(profile);
      });
    }
  }

  getUserProfile(profile){
    if(profile){
      this.user
        .getFormData(this.profile.name)
        .subscribe(
          data=>{
            console.log(data);
            this.profileData=data;
          }
        )

    }
  }



}
