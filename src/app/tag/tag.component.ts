import {Component} from '@angular/core';
import {MatChipInputEvent} from '@angular/material';
import {ENTER, COMMA} from '@angular/cdk/keycodes';

/**
 * @title Chips with input
 */
@Component({
  selector: 'app-tag',
  template:`
    <mat-form-field class="demo-chip-list">
      <mat-chip-list #chipList>
        <mat-chip color="{{colors[i%colors.length]}}" 
                  selected="true"
                  *ngFor="let fruit of fruits;let i=index;"
                  [selectable]="selectable"
                  [removable]="removable" 
                  (remove)="remove(fruit)">
          {{fruit.name}}
          <mat-icon matChipRemove *ngIf="removable">cancel</mat-icon>
        </mat-chip>
        <input placeholder="New Tag..."
               [matChipInputFor]="chipList"
               [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
               [matChipInputAddOnBlur]="addOnBlur"
               (matChipInputTokenEnd)="add($event)" />
      </mat-chip-list>
    </mat-form-field>
  `,
  styleUrls: ['tag.component.css']
})
export class TagComponent {
  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = true;

  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA];

  colors=['primary','accent','warn','']
  fruits = [
    { name: 'Lemon' },
    { name: 'Lime' },
    { name: 'Apple' },
  ];


  add(event: MatChipInputEvent): void {
    let input = event.input;
    let value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.fruits.push({ name: value.trim() });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(fruit: any): void {
    let index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }
}
