import { Component, OnInit } from '@angular/core';
import { NzModalService, NzModalRef, NzMessageService, NzTreeNodeOptions, NzTreeComponent } from 'ng-zorro-antd';
import { TongchangHttpService } from 'tongchang-lib';
import { AccountFormComponent } from './account-form/account-form.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})

export class AccountComponent implements OnInit {

  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  position:string = 'bottom'
  listOfDisplayData:params[] = [];
  page = 1;
  size = 10;
  loading = true;
  total = 1;
  listOfAllData:params[] = []
  mapOfCheckedId: { [key: string]: boolean } = {};
  selectItems = []
  baseUrl='/account'
  checkUrl='/account/enable/' //启用
  stopUrl='/account/stop/' //停用
  treeUrl='/account/queryUnit' //停用

  trees: NzTreeNodeOptions[] = [
    {
      title: 'parent 1',
      key: '100',
      children: [
        {
          title: 'parent 1-0',
          key: '1001',
          disabled: true,
          children: [
            { title: 'leaf 1-0-0', key: '10010', disableCheckbox: true, isLeaf: true },
            { title: 'leaf 1-0-1', key: '10011', isLeaf: true }
          ]
        },
        {
          title: 'parent 1-1',
          key: '1002',
          children: [
            { title: 'leaf 1-1-0', key: '10020', isLeaf: true },
            { title: 'leaf 1-1-1', key: '10021', isLeaf: true }
          ]
        }
      ]
    }
  ];

  constructor(
    private modal: NzModalService,
    private msg: NzMessageService,
    private http: TongchangHttpService,
  ) { }

  ngOnInit() {
    this.getData()
    this.getTree()
  }

  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.listOfDisplayData.every((item) => this.mapOfCheckedId[item.id]);
    let checkId = this.mapOfCheckedId
    this.selectItems = this.listOfDisplayData.map((item) => {
      for(let key in checkId) {
        if(checkId[key] && Number(key) === item.id) {
          return item
        }
      }
    }).filter(item => item)
    this.isIndeterminate = 
      this.listOfDisplayData.some(item => this.mapOfCheckedId[item.id]) && !this.isAllDisplayDataChecked;
  }

  checkAll(value: boolean): void {
    this.listOfDisplayData.forEach(item => (this.mapOfCheckedId[item.id] = value));
    this.refreshStatus();
  }
  //新增操作
  Add() {
    debugger
    const param = new params;
    let modalRef:NzModalRef = this.modal.create({
      nzTitle:"参数配置",
      nzContent:AccountFormComponent,
      nzWidth:700,
      nzComponentParams:{param},
      nzFooter:[
        {
          label:'取消',
          onClick:() => modalRef.close()
        },
        {
          label:'确定',
          type:'primary',
          disabled:comp => !comp.validateForm.valid,
          onClick:(comp) => {
            let formVal = comp.validateForm.getRawValue()
            console.log(formVal);
            this.modal.confirm({
              nzTitle: '提交',
              nzContent: '确认提交?',
              nzOnOk: () => {
                const params = formVal;
                this.http.post(this.baseUrl,params).subscribe(res => {
                  if(res.code !==0) {
                    this.msg.error(res.message);
                    return
                  }
                  this.msg.success(res.message);
                  modalRef.close()
                  this.getData();
                })
              }
            })
      
          }
        }
      ],
      nzWrapClassName: 'modal-vertical-center'
    })
  }
  //修改操作
  Edit() {
    const param = this.selectItems[0]
    if(this.selectItems.length !== 1 ) {
      this.msg.warning('请选择一项数据进行操作!')
      return;
    }
    let modalRef:NzModalRef = this.modal.create({
      nzTitle:"参数配置",
      nzContent:AccountFormComponent,
      nzWidth:700,
      nzComponentParams:{param},
      nzFooter:[
        {
          label:'取消',
          onClick:() => modalRef.close()
        },
        {
          label:'确定',
          type:'primary',
          disabled:comp => !comp.validateForm.valid,
          onClick:(comp) => {
            let formVal = comp.validateForm.getRawValue()
            this.modal.confirm({
              nzTitle: '提交',
              nzContent: '确认提交?',
              nzOnOk: () => {
                const params = {
                  ...param,
                  ...formVal
                };
                this.http.put(this.baseUrl,params).subscribe(res => {
                  if(res.code !==0) {
                    this.msg.error(res.message);
                    return
                  }
                  this.msg.success(res.message);
                  modalRef.close()
                  this.getData();
                })
              }
            })
          }
        }
      ],
      nzWrapClassName: 'modal-vertical-center'
    })
    
  }
  //删除操作
  Delete() {
    if(this.selectItems.length === 0 ) {
      this.msg.warning('请先选择数据进行操作!')
      return;
    }
    const selectedIds = this.selectItems.map(it => it.id) + ''
    this.modal.confirm({
      nzTitle:'删除',
      nzContent:'确认删除?',
      nzOnOk:() => {
        this.http.delete(`${this.baseUrl}/${selectedIds}`).subscribe(res => {
          if(res.code !==0) {
            this.msg.error(res.message);
            return
          }
          this.msg.success(res.message);
          this.getData();
        })
      }
    })
  }
  //启用
  Check() {
    if(this.selectItems.length === 0 ) {
      this.msg.warning('请先选择数据进行操作!')
      return;
    }
    const checkStatus = this.selectItems.every(it => !it.enable)
    if(!checkStatus) {
      this.msg.warning('请选择禁用状态的数据进行操作')
      return;
    }
    const selectedIds = this.selectItems.map(it => it.id) + ''
    this.http.get(`${this.checkUrl}?ids=${selectedIds}`).subscribe(res => {
      if(res.code !== 0) {
        this.msg.error(res.message);
        return
      }
      this.msg.success(res.message);
      this.getData();
    })
  }
  //停用
  Stop () {
    if(this.selectItems.length === 0 ) {
      this.msg.warning('请先选择数据进行操作!')
      return;
    }
    const checkStatus = this.selectItems.every(it => it.enable)
    if(!checkStatus) {
      this.msg.warning('请选择启用状态的数据进行操作')
      return;
    }
    const selectedIds = this.selectItems.map(it => it.id) + ''
    this.http.get(`${this.stopUrl}?ids=${selectedIds}`).subscribe(res => {
      if(res.code !== 0) {
        this.msg.error(res.message);
        return
      }
      this.msg.success(res.message);
      this.getData();
    })
  }
  //刷新
  Query() {
    this.getData()
  }

  //初始出请求
  getData() {
    this.mapOfCheckedId = {}
    this.loading = true;
    this.http.get<any>(`${this.baseUrl}?page=${this.page}&size=${this.size}`).subscribe(res => {
      this.loading = false;
      if(res.code === 0) {
        this.listOfDisplayData = res.data.list;
        this.refreshStatus()
      }
    })
  }

  changePageIndex(pageIndex) {
    this.page = pageIndex;
    this.getData()
  }
  changePageSize (pageSize) {
    this.size = pageSize
    this.getData()
  }
  yesOrno(value) {
    return value === 'true' || value === true || value === '是' ? '是' : '否'
  }
  //账号目录树查询
  getTree() {
    this.loading = true;
    this.http.get<any>(`${this.treeUrl}`).subscribe(res => {
      this.loading = false;
      if(res.code === 0) {
        console.log(res)
      }
    })
  }

  nzClick(value){
    console.log(value);
  }

}
class params {
  id:number        //编号
  account:string;  //账号
  pass:string;     //登录密码
  name:string;    //姓名
  unit_id:number;  //所属单位
  phone:string;     //联系电话
  email:string;     //邮箱
  enable:boolean;  //是否启用
  on_trial:boolean;  //是否试用
  trial_end	:string;  //试用到期时间
  role_id:string;  //角色
  super:boolean;  //是否为管理员
  manage_host?:string;  //管理主机授权
}
