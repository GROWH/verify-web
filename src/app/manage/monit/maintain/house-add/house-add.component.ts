import { Component, OnInit, ViewChild, ElementRef, ViewContainerRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { TongchangLibService, ClientRectDirective, DebugLog, SimpPhoneValidator } from 'tongchang-lib';
import { FormBuilder, FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';

interface Point {
  x: number;
  y: number;
  code?: string;
  name?: string;
}

interface WarnFormGroup {
  types: string[];
  nums:  string[];
  delay: number;
  span:  number;

}

@Component({
  selector: 'app-house-add',
  templateUrl: './house-add.component.html',
  styleUrls: ['./house-add.component.scss']
})
export class HouseAddComponent implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement> 
  @ViewChild(ClientRectDirective) imgRectDirective: ClientRectDirective

  constructor(
    private fb: FormBuilder,
    private msg: NzMessageService,
    private util: TongchangLibService,
  ) { }

  ngOnInit() {
    this.paramsFormInit()
  }
  
  step = 0
  houseImageUrl = ''
  imgWidth = 0
  imgHeight = 0

  pointAdding = false
  pointRemoving = false

  paramsForm: FormGroup

  points: Point[] = []

  warnTypes = [
    { label: '温度', value: 'temp' },
    { label: '湿度', value: 'humi' },
    { label: '断电', value: 'power' },
    { label: '断网', value: 'network' },
  ]

  warnCodeMap = this.warnTypes.reduce((acc, it) => {
    acc[it.value] = it.label
    return acc
  }, {})

  tempMarks = {
    [-50]: '-50°C',
    0: '0°C',
    37: '37°C',
    50: {
      style: {
        color: '#f50'
      },
      label: '<strong>50°C</strong>'
    }
  };

  humiMarks = {
    0: '0%',
    50: '50%',
    100: {
      style: {
        color: '#f50'
      },
      label: '<strong>100%</strong>'
    }
  }

  /**
   * 获取告警表单组下所有告警电话
   * @param groupName 表单组名
   */
  getPhoneNums(groupName: string): string[] {
    return this.paramsForm.get(groupName).get('nums').value || []
  }

  /**
   * 告警电话添加
   * @param groupName 表单组名
   * @param phoneNoInput 电话输入框 Input
   */
  onPhoneAdd(groupName: string, phoneNoInput: HTMLInputElement) {
    const phoneNo = phoneNoInput.value
    const numsCtrl  = this.paramsForm.get(groupName).get('nums') as FormControl
    const inputCtrl = this.fb.control(phoneNo, [ Validators.required, SimpPhoneValidator ])

    if (!inputCtrl.valid) return this.msg.error('请输入正确的手机号')
    const nums: string[] = numsCtrl.value || []
    if (nums.indexOf(phoneNo) > -1) return this.msg.error('手机号已添加')
    numsCtrl.setValue([ ...nums, phoneNo ])
    phoneNoInput.value = ''
  }

  /**
   * 告警电话移除
   */
  onPhoneRemove(groupName: string, index: number) {
    const numsCtrl = this.paramsForm.get(groupName).get('nums') as FormControl
    const nums: string[] = numsCtrl.value

    numsCtrl.setValue([
      ...nums.slice(0, index),
      ...nums.slice(index + 1),
    ])
  }

  /**
   * 参数设定表单初始化
   */
  paramsFormInit() {
    const numsValidator: ValidatorFn = (ctrl) => {
      const nums: string[] = ctrl.value || []
      return nums.length < 3 ? { count: true } : null
    }
    
    const warnGroupConf = {
      types: [[],   [ Validators.required ]],
      nums:  [[],   [ numsValidator       ]],
      delay: [null, [ Validators.required ]],
      span:  [null, [ Validators.required ]],
    }


    this.paramsForm = this.fb.group({
      name: [ null, [ Validators.required ]],
      temp: [ [-20, 0 ] ],
      humi: [ [ 20, 40] ],
      phone_warn:   this.fb.group(warnGroupConf),
      message_warn: this.fb.group(warnGroupConf),
    })
  }
  
  /**
   * 告警信息显示用
   */
  warnConfForShow(groupName: string) {
    const data: WarnFormGroup = this.paramsForm.get(groupName).value
    return {
      types: data.types.map(it => this.warnCodeMap[it]).join(','),
      nums:  data.nums.join(','),
      delay: data.delay + '秒',
      span:  data.delay + '秒',
    }
  }

  stopAdd() {
    this.pointAdding = false
  }

  stopRemove() {
    this.pointRemoving = false
  }

  /**
   * 库房图纸添加点击
   */
  async onFileSelect() {
    this.stopAdd()
    this.stopRemove()
    if (this.points.length > 0) {
      await this.util.submitConfirm(
        null,
        '选择新平面图将清空已标记点位, 请确认是否继续?'
      )
    }

    this.fileInput.nativeElement.click()
  }

  /**
   * 监控点位添加按钮点击
   */
  onPointAdd() {
    this.stopRemove()
    if (this.houseImageUrl) return this.pointAdding = !this.pointAdding
    this.msg.error('请先添加库房平面图')
  }
  
  /**
   * 监控点位移除按钮点击
   */
  onPointRemove() {
    this.stopAdd()
    if (this.houseImageUrl) return this.pointRemoving = !this.pointRemoving
    this.msg.error('请先添加库房平面图')
  }

  onNext() {
    switch (this.step) {
      case 0:
        this.stopAdd()
        this.stopRemove()
        if (this.points.length === 0) return this.msg.error('请添加点位')
        break;
      case 1:
        if (!this.points.every(it => !!it.code && !!it.name)) return this.msg.error('请完整填写温度计信息')
        break;
      default:
        break;
    }
    this.step += 1
  }
  
  onPrev() {
    this.step -= 1
    if (this.step === 0) this.triggerResize()
  }

  removePoint(index: number) {
    if (!this.pointRemoving) return 
    const points = this.points
    this.points = [
      ...points.slice(0, index),
      ...points.slice(index + 1),
    ]
  }

  fileCh(e: Event) {
    const file = (e.target as HTMLInputElement).files[0];
    if (!file) return
    if (!/^image\//.test(file.type)) return this.msg.error('请选择图片文件')

    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = () => {
      this.points = []
      this.houseImageUrl = reader.result as string;
      DebugLog(reader.result)
      this.triggerResize()
    }
  }

  wrapperSizeCh(width: number, height: number) {
    DebugLog(JSON.stringify({width, height}))
    this.imgWidth = width
    this.imgHeight = height
  }

  imgClick(e: MouseEvent) {
    if (!this.pointAdding) return 

    const precent = (float: number, precis: number = 2) => {
      const ratio = 10 ** precis
      return Math.round(float * ratio) / ratio
    }

    const pos = {
      x: precent(e.offsetX * 100 / this.imgWidth),
      y: precent(e.offsetY * 100 / this.imgHeight),
    }

    this.points.push(pos)
    DebugLog(JSON.stringify(pos))
  }

  private triggerResize() {
    setTimeout(() => {
      this.imgRectDirective.onResize()
    }, 10);
  }
}
