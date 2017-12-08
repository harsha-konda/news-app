import { Component, OnInit} from '@angular/core';
import { AuthService } from './../auth/auth.service';
import {UsersService} from "./users.service";
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {single, multi} from './data';
import {Users} from "./users.entity";


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profile: any;
  profileData: any;

  single: any[];
  multi: any[];

  topics;
  hearts;
  colors=['primary','accent','warn','']

  constructor(public auth: AuthService,public user:UsersService) {
    Object.assign(this, {single, multi})
  }

  showFullData=false;
  ngOnInit() {
    if (this.auth.userProfile) {
      this.profile = this.auth.userProfile;
      this.getUserProfile(this.profile);
      this.getHearts();
    } else {
      this.auth.getProfile((err, profile) => {
        this.profile = profile;
        this.getUserProfile(profile);
        this.getHearts();

      });
    }
  }


  view: any[] = [700, 400];

  // options
  showLegend = true;

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  // pie
  showLabels = true;
  explodeSlices = false;
  doughnut = false;


  onSelect(event) {
    console.log(event);
  }


  /**
   * Get Hearts
   * */
  getHearts(){
    this.user
      .getUserHeart(this.profile.nickname)
      .subscribe(data=>{
        this.hearts=data;
        console.log(this.hearts);
      });
  }

  /**
   * Get all the topics
   * */
  getTopics(){
    this.user
      .getSubscriptions()
      .subscribe(
        data=> {
          var submap=[]
          if(this.profileData) {
            var set = new Set(this.profileData.subscription);
            data.map(x => submap.push({link: x, sub: set.has(x)}))
            this.topics = submap;
          }else{
            this.getUserProfile(this.profile);
          }
        }
    )
  }

  /**
   * add subscription
   * */
  addSubsctiption(urls){
    this.user.addSubscription(urls[urls.length-1].name).subscribe();
  }

  /**
   * Dynamically update subcriptions
   * */
  handleSubscrption(i){
    this.topics[i].sub=!this.topics[i].sub;
    this.profileData.subscription=[]
    this.topics.map(x=>{
      if(x.sub)
        this.profileData.subscription.push(x.link);
    })

    this.updateUser(this.profileData);
  }

  /**
   * gets a user profile
   * if it doesn't exist it create a new one
   * */
  getUserProfile(profile){
      this.user
        .getFormData(this.profile.nickname)
        .subscribe(
          data=>{
              this.profileData=data;
            console.log(data);

            this.getTopics();
          },
          err => {
            console.log("fuck");

            this.createUserProfile();
            this.getTopics();
          },
      )
  }

  updateUser(body){
    this.user.updateUser(body).subscribe();
  }

  createUserProfile(){
    this.user
      .createUser(new Users(this.profile.nickname))
      .subscribe();
  }

}
