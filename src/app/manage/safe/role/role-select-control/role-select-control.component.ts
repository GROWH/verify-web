import { Component, OnInit, Input, Injector } from '@angular/core';
import { NzTreeNodeOptions, NzTreeComponent } from 'ng-zorro-antd';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { SystemModule, convertNodes, getTreeKeys } from '@/model/SystemModule';
import { RoleService } from '../role.service';
import { RoleUniSerToken } from '../../safe.routing';

@Component({
  selector: 'app-role-select-control',
  templateUrl: './role-select-control.component.html',
  styleUrls: ['./role-select-control.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: RoleSelectControlComponent,
      multi: true,
    }
  ]
})
export class RoleSelectControlComponent implements ControlValueAccessor {

  // @Input() moTree: SystemModule[] = [];
  
  @Input() roleType: number;

  roleSer: RoleService;

  constructor(
    injector: Injector
  ) {
    this.roleSer = injector.get(RoleUniSerToken)
  }
  
  treeNodes: NzTreeNodeOptions[] = []
  get moTree(): SystemModule[] {
    const roleSer = this.roleSer

    const adminRolesMap = {
      [1]: roleSer.platformRights.moduleTree,
      [2]: roleSer.verifyRights.moduleTree,
      [3]: roleSer.customRights.moduleTree,
    }

    if (this.roleType) {
      return adminRolesMap[this.roleType]
    } else {
      return []
    }
  }

  onValueCh: (moIDs: number[]) => void

  onCheckedCh(tree: NzTreeComponent) {
    const checked = tree.getCheckedNodeList()
    const halfChecked = tree.getHalfCheckedNodeList()
  
    const checkedIds = [
      ...getTreeKeys(checked),
      ...halfChecked.map(it => it.key)
    ].map(it => +it)

    this.onValueCh(checkedIds)
  }

  writeValue(value: number[] | null | undefined) {
    if (!value) value = []
    const moTree = this.moTree
    this.treeNodes = convertNodes(moTree, value)
  }

  registerOnChange(fn) {
    this.onValueCh = fn
  }

  registerOnTouched(fn) {

  }

  setDisabledState(isDisabled: boolean) {

  }

  ngOnInit() {
  }

}
