import {Component, Input, OnInit,OnChanges} from '@angular/core';

import {PostsService} from './posts.service';
import {SearchService} from "../search.service";
import {AuthService} from "../auth/auth.service";

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit,OnChanges {

  posts;
  es;
  auth;
  @Input() topic: String="http://www.cnn.com";

  page=0;
  maxPages;

  constructor(es:SearchService,auth:AuthService) {
    this.es=es;
    this.auth=auth;
  }

  ngOnInit() {
    this.query();
  }

  ngOnChanges(){
    this.query();
  }

  query(){
    this.es.search("link",this.topic,"news").then((result)=>{

       this.posts=(result.hits.hits);
       var num=Math.ceil(this.posts.length/10)
       this.maxPages= Array(num>10?10:num).fill(0).map((x,i)=>i);
    }).catch((error) => {console.log(error)});
  }

  nextPage(){
    if(this.page< Math.floor(this.posts.length/10))
      this.page++;
  }

  prevPage(){
    if(this.page>0)
      this.page--;
  }

  setPage(val){
    this.page=val;
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
