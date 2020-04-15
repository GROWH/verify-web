import { Component, OnInit, Input, Injector } from '@angular/core';
import { RoleService } from '../role.service';
import { NzTreeNodeOptions } from 'ng-zorro-antd';
import { DebugLog } from 'tongchang-lib';
import { convertNodes } from '@/model/SystemModule';
// import { RoleUniSerToken } from '../../safe.routing';

@Component({
  selector: 'app-role-view',
  templateUrl: './role-view.component.html',
  styleUrls: ['./role-view.component.scss']
})
export class RoleViewComponent implements OnInit {

  @Input() roleIds: number [];
  @Input() roleSer: RoleService;

  nodes: NzTreeNodeOptions[] = []

  constructor() {}

  ngOnInit() {
    const mos = this.roleSer.getModuleTreeByCode(this.roleSer.moduleTree, this.roleIds)

    this.nodes = convertNodes(mos, [])
    DebugLog(this.nodes)
  }

}
