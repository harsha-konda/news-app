import {Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges} from '@angular/core';
import { DatePipe } from '@angular/common';
import {Comment} from "./comment.entity"

import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  constructor() { }

  @Input() uid="harsha";
  @Input() pid="dkahsdjkha";
  @Input() comment


  @Output() notify: EventEmitter<Comment> = new EventEmitter<Comment>();



  // ngOnChanges(changes: SimpleChanges){
  //   this.comment=changes.comment;
  // }
  ngOnInit(){

  }

  onSubmit(f: NgForm){
    this.showBox=false;
    var newComment={
      text:f.value.text,
      uid:this.uid,
      timestamp:Date.now(),
      pid:this.comment?this.comment.pid:this.pid,
      replies:[]
    }

    if(this.comment)
      this.comment.replies.push(newComment);
    else
      this.comment=newComment;

    this.notify.emit(this.comment);

  }

  showBox=false;
  ocBox(){
    this.showBox=!this.showBox;
  }

  onNotify(event:Comment){
    this.comment.result.push(event);
    this.notify.emit(this.comment);
  }

  curUser="harsha"
  data={
    Post: "postid",
    Author: "majd sakr",
    image:"blah",
    Time : new Date("2013-02-20T12:01:04.753Z").getTime(),
    Text: " I'm so efficient at torchering students and ta's",


    Replies:[
      {Author:"Cameron",image:"blah",Time:new Date("2013-02-20T12:01:04.753Z"),Text:"Your'e not doing a goodjob at this! Why are you cutting down the project workload?"},
      {Author:"Marshal",image:"blah",Time:new Date("2013-02-20T12:05:04.753Z"),Text:"I refactored the code to remove the bugs 1 day before deadline"},
      {Author:"Cameron",image:"blah",Time:new Date("2013-02-20T12:10:04.753Z"),Text:"Cant believe you are my colleague, bish!"}

    ]
}

  timeDiff=function timeDiff(Date2,Date1){

    if(Date2-Date1<3600)
      return (Date2-Date1)/60

    if(Date2-Date1<86400)
      return (Date2-Date1)/3600

    return (Date2-Date1)/86400
  }

}
