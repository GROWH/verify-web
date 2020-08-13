import {Component, Input} from "@angular/core";
import {GridAction} from "@/model/GridAction";

@Component({
  selector: 'grid-action',
  templateUrl: './grid-actions.component.html',
  styleUrls: ['./grid-actions.component.scss']
})

export class GridActionsComponent {
  @Input() actions: GridAction[];
  _actions: GridAction[] = []

  constructor() {
  }

  ngOnInit() {
    this._actions = this.actions.filter(it => it.isExist)
  }
}
