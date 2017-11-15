import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  curDate=new Date().getTime()


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
