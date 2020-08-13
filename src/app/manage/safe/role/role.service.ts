import { Injectable } from '@angular/core';
import { NzModalService, NzMessageService, NzModalRef, NzTreeNodeOptions } from 'ng-zorro-antd';
import { UniversalService, TongchangHttpService, TongchangLibService, PaginationRes, TongchangPipesModule } from 'tongchang-lib';

import { Apis, ResTrans } from '@shared/urls.const'

import { RoleFormComponent } from './role-form/role-form.component'
import { Role, RoleWithMos } from '@/model/Role';
import { PLATFORM_RIGHTS_KEY, VERIFY_COMP_RIGHTS_KEY, VERIFY_CUSM_RIGHTS_KEY } from '@/config.const';
import { CommonService } from '@/core/common.service';
import { SystemModule } from '@/model/SystemModule';

@Injectable()
export class RoleService extends UniversalService<Role> {

  pageMinus = 0
  resTrans = ResTrans
  crudUrl = Apis.role
  formComp = RoleFormComponent

  dataHandle = (datas: RoleWithMos[]) => {
    return datas.map(it => {
      const role: Role = {
        ...it,
        resource: it.resource.map(it => it.id)
      }

      return role
    })
  }

  constructor(
    public modal: NzModalService,
    public msg: NzMessageService,
    public http: TongchangHttpService,
    public util: TongchangLibService,
    private commSer: CommonService,
  ) {
    super()
  }

  moduleTree: SystemModule[] = []

  platformRights = {
    key: PLATFORM_RIGHTS_KEY,
    moduleTree: [],
  }

  verifyRights = {
    key: VERIFY_COMP_RIGHTS_KEY,
    moduleTree: [],
  }

  customRights = {
    key: VERIFY_CUSM_RIGHTS_KEY,
    moduleTree: [],
  }

  adminRoles = [
    this.platformRights,
    this.verifyRights,
    this.customRights,
  ]

  /**
   * 管理员权限加载
   */
  async loadAdminRoles() {
    const { data: moduleTree } = await this.commSer.getModuleTree().toPromise()

    this.moduleTree = moduleTree

    const rights = (
      await this.commSer.getParamsByKey(
        ...this.adminRoles.map(it => it.key)
      ).toPromise()
    ).data

    this.adminRoles.forEach(item => {
      item.moduleTree = this.getModuleTreeByCode(moduleTree, rights[item.key])
    })
  }

  /**
   * 模块子树构建
   * @param moTree 模块树
   * @param moIds  角色拥有的模块ID
   */
  getModuleTreeByCode(moTree: SystemModule[], moIds: number[]) {
    return moTree.reduce<SystemModule[]>((acc, it) => {
      if ((moIds||[]).includes(it.id)) {
        const node = {
          ...it
        }

        if (it.children && it.children.length > 0) {
          node.children = this.getModuleTreeByCode(it.children, moIds)
          // node.isLeaf   = node.children.length === 0
        }
        acc.push(node)
      }
      return acc
    }, [])
  }

  getActions() {
    return [
      {
        name: '新增',
        icon: 'plus',
        code: 'role_add',
        type: 'primary',
        click: () => {
          const modalRef: NzModalRef = this.modal.create({
            nzTitle: '新增角色',
            nzContent: RoleFormComponent,
            nzComponentParams: {
              // TODO: 登录后应传入登录人员对应单位类型
              originData: new Role([], 1)
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
                onClick: comp => this.onAddSubmit(modalRef, comp.formVal),
                disabled: comp => !comp.form.valid
              }
            ]
          })
        },
        isExist: true,
      },
      {
        name: '刷新',
        icon: 'reload',
        code: 'role_reload',
        type: 'dashed',
        click: () => {
          this.onForceReload()
        },
        isExist: true,
      }
    ]
  }

  private async onAddSubmit(modalRef: NzModalRef, formVal: Role) {
    await this.util.submitConfirm()
    const res = await this.http.post<Role>(
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
      this.onForceReload()
    }
  }
}
