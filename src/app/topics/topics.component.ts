import { Component, OnInit } from '@angular/core';
import {Topics} from './topics.entity';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.css']
})
export class TopicsComponent implements OnInit {


  constructor() { }

  topics=Topics.data;
  ngOnInit() {
  }

}
