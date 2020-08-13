import { Component, OnInit, Injector } from '@angular/core';
import { UniversalComponent, GridAction, TongchangHttpService, TongchangLibService } from 'tongchang-lib';
import { RoleService } from './role.service';
import { ActivatedRoute } from '@angular/router';
import { Apis } from '@/shared/urls.const';
import { Role } from '@/model/Role';
import { NzModalService, NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { RoleViewComponent } from './role-view/role-view.component';
import { RoleFormComponent } from './role-form/role-form.component';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent extends UniversalComponent {

  roleTypeMap = {
    [1]: '平台',
    [2]: '实施',
    [3]: '客户',
  }

  uniSer!: RoleService;
  gridActions!: GridAction[];
  tableHeight = '500px'

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private msg: NzMessageService,
    private modal: NzModalService,
    private http: TongchangHttpService,
    private util: TongchangLibService,

  ) {
    super(injector, route)
  }


  ngOnInit() {
    this.uniSer.gridConf = {
      queryUrl: Apis.role,
      queryBody: null,
      queryParam: {},
      queryMethod: 'get',
      page: 1,
      size: 50,
    }

    this.gridActions = this.uniSer.getActions()

    this.uniSer.loadAdminRoles()
  }

  view(item: Role) {
    const modalRef: NzModalRef = this.modal.create({
      nzTitle: item.role_name,
      nzContent: RoleViewComponent,
      nzComponentParams: {
        roleIds: item.resource,
        roleSer: this.uniSer,
      },
      nzMaskClosable: false,
      nzWrapClassName: 'modal-vertical-center height-fixed',
      nzWidth: 900,
      nzFooter: null

    })
  }

  edit(item: Role) {
    const modalRef: NzModalRef = this.modal.create({
      nzTitle: '修改角色',
      nzContent: RoleFormComponent,
      nzComponentParams: {
        originData: item
      },
      nzMaskClosable: false,
      nzWrapClassName: 'modal-vertical-center height-fixed',
      nzWidth: 900,
      nzFooter: [
        {
          label: '取消',
          onClick: () => modalRef.close()
        },
        {
          label: '提交',
          type: 'primary',
          onClick: comp => this.onEditSubmit(modalRef, comp.formVal),
          disabled: comp => !comp.form.valid
        }
      ]
    })

  }

  async del(item: Role) {
    await this.uniSer.util.submitConfirm(null, '确定删除?')
    const res = await this.http.delete(Apis.role + `/${item.id}`).toPromise()

    if (res.code === 0) this.uniSer.onForceReload()
  }

  private async onEditSubmit(modalRef: NzModalRef, formVal: Role) {
    await this.util.submitConfirm()
    const res = await this.http.put<Role>(
      Apis.role,
      {
        ...formVal,
        resource: undefined,
      },
      { mids: formVal.resource.join(',') }
    ).toPromise()

    if (res.code === 0) {
      this.msg.success(res.message)
      modalRef.close()
      this.uniSer.onForceReload()
    }
  }
}
