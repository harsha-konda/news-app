import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-heart',
  template:`    
    <button mat-icon-button color="warn"
      (click)="change()" ><mat-icon>{{switch?'favorite':'favorite_border'}}</mat-icon>
    </button>
    
  `,
  styleUrls: ['./heart.component.css']
})
export class HeartComponent implements OnInit {

  @Input() switch: boolean=false;

  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  change(){
    this.switch =!this.switch;
    this.notify.emit(this.switch);
  }

}
