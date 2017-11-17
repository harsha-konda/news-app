import { Component, OnInit } from '@angular/core';

import {PostsService} from './posts.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  postService;
  posts;
  constructor(postService : PostsService) {
    this.postService=postService;
  }

  ngOnInit() {
    this.getFormData();
  }


  getFormData() {
    this.postService
        .getFormData()
        .subscribe(
      data =>{
            this.posts= data;
            console.log(data);
      });;
  }

  switchText(value){

    value.displayText=!value.displayText
    return value
  }

  switchComment(value){

    value.displayComment=!value.displayComment
    return value
  }

  incrementUpvotes(value){

    value['_source'].upvotes+=1
  }


}
