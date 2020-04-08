import { Component, Input } from "@angular/core";
import { GridAction } from "@/model/GridAction";

@Component({
  selector: 'grid-action',
  templateUrl: './grid-actions.component.html',
  styleUrls: ['./grid-actions.component.scss']
})

export class GridActionsComponent {
  @Input() actions: GridAction[];

  constructor() {
  }

}
