import { Component, OnInit } from '@angular/core';
import { AuthService } from './../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public auth: AuthService) { }

  cur=0
  formattedSubs;
  ngOnInit() {
    this.formattedSubs=this.subs.map(a=>
      a.replace("http:\/\/","")
      .replace("\.com","")
        .replace("www\.",""));

    this.active[0]=true;
  }

  switchCur(cur){
    console.log(cur);
    this.cur=cur;
  }

  subs=['http://www.huffingtonpost.com', 'http://cnn.com', 'http://www.time.com', 'http://www.ted.com', 'http://pandodaily.com', 'http://www.cnbc.com']
  active=Array(this.subs.length).fill(false);

  images=['http://cdn01.dailycaller.com/wp-content/uploads/2017/09/4966404096_b25ec260af_b-e1505493448339.jpg',
        'http://ichef.bbci.co.uk/corporate2/images/width/live/p0/1z/0f/p01z0fv1.jpg/624',
        'https://cdn-images-1.medium.com/max/1600/1*A_esY0CypWIk5K6sR9lJnQ.jpeg',
  ]

}
