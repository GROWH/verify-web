import {Component, Injector, OnInit} from '@angular/core';
import {GridAction} from '@/model/GridAction';
import {NzMessageService, NzModalRef, NzModalService} from "ng-zorro-antd";
import {BaseInfoAddComponent} from "@/manage/verify/base-info/base-info-add/base-info-add.component";
import {ActivatedRoute, Router} from "@angular/router";
import {buttonAccess} from "@/config.const";

@Component({
  selector: 'app-verify-task',
  templateUrl: './verify-task.component.html',
  styleUrls: ['./verify-task.component.scss']
})
export class VerifyTaskComponent implements OnInit {

  constructor(
    private modal: NzModalService,
    private router: Router,
    private route: ActivatedRoute,
    private msg: NzMessageService,
  ) {
  }

  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  page = 1;
  size = 10;
  loading = true;
  total = 1;
  gridActions: GridAction[] = [];
  mapOfCheckedId: { [key: string]: boolean } = {};
  selectItems = [];
  listOfData: TableList[] = [];

  ngOnInit() {
    this.actionInit()
  }

  actionInit() {
    this.gridActions = [
      {
        name: '新建任务',
        icon: 'plus',
        code: 'verify-task_add',
        type: 'primary',
        click: () => {
          this.onAdd()
        },
        isExist: buttonAccess("verify-task_add"),
      }, {
        name: '验证操作',
        icon: 'check-circle',
        code: 'verify-task_operate',
        type: 'default',
        click: () => {
          if (this.selectItems.length === 0) {
            this.msg.warning('请选择一项数据进行操作!')
            return;
          }
          this.router.navigate(['detail'], {relativeTo: this.route,})
        },
        isExist: buttonAccess("verify-task_operate"),
      }, {
        name: '修改',
        icon: 'edit',
        code: 'verify-task_edit',
        type: 'default',
        click: () => {
          if (this.selectItems.length === 0) {
            this.msg.warning('请选择一项数据进行操作!')
            return;
          }

        },
        isExist: buttonAccess("verify-task_edit"),
      }, {
        name: '删除',
        icon: 'delete',
        code: 'verify-task_delete',
        type: 'danger',
        click: () => {
          if (this.selectItems.length === 0) {
            this.msg.warning('请选择一项数据进行操作!')
            return;
          }
        },
        isExist: buttonAccess("verify-task_delete"),
      },
    ]
  }

  //分页
  changePageIndex(pageIndex) {
    this.page = pageIndex;
  }

  changePageSize(pageSize) {
    this.size = pageSize
  }

  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.listOfData.every((item) => this.mapOfCheckedId[item.check_no]);
    let checkId = this.mapOfCheckedId
    this.selectItems = this.listOfData.map((item) => {
      for (let key in checkId) {
        if (checkId[key] && key === item.check_no) {
          return item
        }
      }
    }).filter(item => item)
    this.isIndeterminate = this.listOfData.some(item => this.mapOfCheckedId[item.check_no]) && !this.isAllDisplayDataChecked;
  }

  checkAll(value: boolean): void {
    this.listOfData.forEach(item => (this.mapOfCheckedId[item.check_no] = value));
    this.refreshStatus();
  }

  private onAdd() {
    const modalRef: NzModalRef = this.modal.create({
      nzTitle: '新建任务',
      nzContent: BaseInfoAddComponent,
      nzComponentParams: {
        afterDone: () => modalRef.close(),
        openType: "task",
      },
      nzMaskClosable: false,
      nzWrapClassName: 'modal-vertical-center height-fixed no-padding',
      nzWidth: 900,
      nzFooter: null,
    })
  }

  private onEdit() {

  }

  //开始验证
  startVerify(record, $event) {
    $event.stopPropagation();
    console.log('开始验证', record)
  }

}

export class TableList {
  check_no: string;
  check_name: string;
  check_unit: string;
  check_unit_type: string;
  check_impl_unit: string;
  check_target: string;
  temp_high: string;
  temp_low: string;
  check_type: string;
  check_mold: string;
  check_progress?: any;
  task_start_time?: string;
  expected_complet_time?: string;
}
