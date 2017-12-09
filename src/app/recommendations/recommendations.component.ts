import { Component, OnInit,Input } from '@angular/core';
import {AuthHttp} from "angular2-jwt";
import {AUTH_CONFIG} from "../auth/auth0-variables";

@Component({
  selector: 'app-recommendations',
  template: `
    <mat-card class="card text-center" style="margin: 1.5% 0%"
              *ngFor="let post of posts">
      <div class="card-header"><h3>{{post['_source'].title}}</h3></div>
      
      <div class="row">
        <div class="col-md-8">
          <div class="card-block">
            <p class="text-justify lead" style="padding: 2%" *ngIf="!post.displayText">{{post['_source'].summary}}</p>
            <p class="text-justify lead" style="padding: 2%" *ngIf="post.displayText">{{post['_source'].text}}</p>
        </div>
        </div>

        <div class="col-md-4">
          <div class="card-img-bottom">
            <img src="{{post['_source'].image}}" style="width: 100%" class="rounded float-right" alt="...">
          </div>
        </div>
      </div>
    </mat-card>

  `,
  styleUrls: ['./recommendations.component.css']
})
export class RecommendationsComponent implements OnInit {

  auth;
  @Input() user="konda.harsha1";
  posts;
  constructor(auth:AuthHttp) {
    this.auth=auth;
  }

  ngOnInit() {
    this.getUserRecommendations();
  }

  getUserRecommendations(){
    var url=AUTH_CONFIG.nodeUrl+"/es/recommend/"+this.user;
    this.auth
      .get(url)
      .subscribe((data)=>{
        this.posts=JSON.parse(data["_body"])['res'];
    });

  }
}
