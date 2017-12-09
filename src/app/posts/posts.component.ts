import {Component, Input, OnInit, OnChanges, Output, EventEmitter} from '@angular/core';

// import {PostsService} from './posts.service';
import {SearchService} from "../search.service";
import {AuthService} from "../auth/auth.service";
import {Comment} from "../comment/comment.entity";
import {NgForm} from "@angular/forms";
import {HeartEntity, TagEntity, Users} from "../profile/users.entity";

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit,OnChanges {

  posts;
  es;
  @Input() topic: String="http://www.cnn.com";

  @Output() notify: EventEmitter<string> = new EventEmitter<string>();
  @Output() output: EventEmitter<Comment>=new EventEmitter<Comment>();
  @Output() heartNotify: EventEmitter<HeartEntity>=new EventEmitter<HeartEntity>();
  @Output() outputTagNotify: EventEmitter<TagEntity>=new EventEmitter<TagEntity>();
  @Input() heart;
  @Input() tags=[];

  page=0;
  maxPages;
  auth;

  heartSet
  uid;
  constructor(auth:AuthService,es:SearchService) {
    this.uid = "konda.harsha1";
    this.es=es;
    this.auth=auth;
  }

  ngOnInit() {
    this.query();
    if(this.heart){
      this.heartSet=new Set(this.heart);
    }
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

    this.output.emit(comment)

    this.es
      .update(this.posts[p])
      .subscribe();
    this.newComment=null;
  }

  /**
   * notify on tag change
   * */
  tagNotify(event,id){
    this.outputTagNotify.emit(new TagEntity(id,event.map(data=>data.name)));
  }

  /**
   * heart notify
   * */
  favoriteNotify(event,id){
    this.heartNotify.emit(new HeartEntity(id,event));
  }

  /**
   * voting
   * */
  onUpvoteChange(event:string,p){

    let data=event.split(":");
    let upvotes=data[2];


    this.posts[p]['_source']['upvotes']=upvotes;


    this.notify
      .emit(data[0]+":"+data[1]);

    this.es
      .update(this.posts[p])
      .subscribe(data=>console.log(data));

  }

  setMaxPages(posts){
    var num=Math.ceil(posts.length/10)
    this.maxPages= Array(num).fill(0).map((x,i)=>i);
  }

  /**
   * get post by link
   * */
  query(){
    this.es.search("link",this.topic,"news").then((result)=>{
       this.posts=(result.hits.hits);
       this.posts=this.posts.sort((a,b)=>{
           var n1=a['_source'].upvotes;
           var n2=b['_source'].upvotes;
           if (n1 < n2)
             return 1;

           if (n1 > n2)
             return -1;

           return 0;
       });
       this.setMaxPages(this.posts);
    }).catch();
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
