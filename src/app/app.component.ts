import { Component } from '@angular/core';
import { DropdownItem } from './multiselect/multiselect.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  dropItems: Array<DropdownItem> = [ {id: 'UK', name: 'United Kingdom'}, {id: 'US', name: 'United States'} ];
  selected: Array<DropdownItem> = [ {id: 'UK', name: 'United Kingdom'} ];

  onUpdate(ev: Array<DropdownItem>): void {
    console.log(ev);
  }

}
