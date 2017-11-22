import {Component, Input, OnInit, OnChanges, Output, EventEmitter} from '@angular/core';

// import {PostsService} from './posts.service';
import {SearchService} from "../search.service";
import {AuthService} from "../auth/auth.service";
import {Comment} from "../comment/comment.entity";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit,OnChanges {

  posts;
  es;
  @Input() topic: String="http://www.cnn.com";


  page=0;
  maxPages;
  auth;

  uid;

  constructor(auth:AuthService,es:SearchService) {
    this.uid = "konda.harsha1";
    this.es=es;
    this.auth=auth;
  }

  ngOnInit() {
    this.query();
  }

  ngOnChanges(){
    this.query();
  }

  onSubmit(f: NgForm){
    this.searchByWord(f.value.text);
  }

  searchByWord(word){
    this.es.searchByword(word)
      .subscribe(data=>{
        this.posts=data;
        this.setMaxPages(this.posts);
      });
  }


  newComment:Comment;
  onNotify(comment:Comment,p:number,c:number){

    if(c==-1) {
      this.posts[p]['_source'].comments.push(comment);
    }else
      this.posts[p]['_source'].comments[c]=comment;

    this.es
      .update(this.posts[p])
      .subscribe();
    this.newComment=null;
  }

  onUpvoteChange(event:number,p){
    console.log("happening");

    this.posts[p]['_source']['upvotes']=event;
    console.log(event);
    console.log(this.posts[p]);
    this.es
      .update(this.posts[p])
      .subscribe(data=>console.log(data));

  }

  setMaxPages(posts){
    var num=Math.ceil(posts.length/10)
    this.maxPages= Array(num).fill(0).map((x,i)=>i);
  }

  query(){
    this.es.search("link",this.topic,"news").then((result)=>{
       this.posts=(result.hits.hits);
        this.setMaxPages(this.posts);
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
