import { Component, OnInit } from '@angular/core';
import { NzModalService, NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { ParamFormComponent } from './param-form/param-form.component';

@Component({
  selector: 'app-param-setting',
  templateUrl: './param-setting.component.html',
  styleUrls: ['./param-setting.component.scss']
})
export class ParamSettingComponent implements OnInit {

  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  position:string = 'bottom'
  listOfDisplayData: any[] = [];
  listOfAllData: any[] = [];
  mapOfCheckedId: { [key: string]: boolean } = {};

  constructor(
    private modal: NzModalService,
    private msg: NzMessageService,
  ) { }

  ngOnInit() {
    for (let i = 0; i < 100; i++) {
      this.listOfAllData.push({
        id: i,
        name: `Edward King ${i}`,
        age: 32,
        address: `London, Park Lane no. ${i}`
      });
    }
  }
  currentPageDataChange($event: Array<{ id: number; name: string; age: number; address: string }>): void {
    this.listOfDisplayData = $event;
    this.refreshStatus();
  }

  refreshStatus(): void {
    let checkId = this.mapOfCheckedId
    const selectItem = this.listOfDisplayData.map((item,index) => {
      for(let key in checkId) {
        if(Number(key) === index) {
          return item
        }
      }
    }).filter(item => item)
    console.log(selectItem)
    this.isAllDisplayDataChecked = this.listOfDisplayData.every(item => this.mapOfCheckedId[item.id]);

    this.isIndeterminate =
      this.listOfDisplayData.some(item => this.mapOfCheckedId[item.id]) && !this.isAllDisplayDataChecked;
      console.log(this.isAllDisplayDataChecked)
      console.log(this.isIndeterminate)
  }

  checkAll(value: boolean): void {
    this.listOfDisplayData.forEach(item => (this.mapOfCheckedId[item.id] = value));
    this.refreshStatus();
  }
  paramAdd() {
    let modalRef:NzModalRef = this.modal.create({
      nzTitle:"参数配置",
      nzContent:ParamFormComponent,
      nzWidth:700,
      nzComponentParams:{},
      nzFooter:[
        {
          label:'取消',
          onClick:() => modalRef.close()
        },
        {
          label:'确定',
          type:'primary',
          disabled:comp => !comp.validateForm.valid,
          onClick:() => {
            console.log(122);
            modalRef.close()
          }
        }
      ],
      nzWrapClassName: 'modal-vertical-center'
    })
  }
  paramEdit() {
    const selectedItems = this.listOfDisplayData
    
  }
  paramDelete() {
    
  }
  paramQuery() {
    
  }

}
