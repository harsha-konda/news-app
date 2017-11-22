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

  ngOnInit(){

  }

  onSubmit(f: NgForm){

    if(!f.valid)
      return

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

}
