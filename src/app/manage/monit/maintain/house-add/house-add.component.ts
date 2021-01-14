import { NzMessageService } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';

import {
  TongchangLibService,
  ClientRectDirective,
  DebugLog,
  SimpPhoneValidator,
  TongchangHttpService,
} from 'tongchang-lib';

import { Apis } from '@/shared/urls.const';
import { HouseAddData, WarnConf, MonitPointConf, StoreHouse } from '@/model/HouseMonit';
import { WARN_TYPES, WARN_CODE_MAP } from '@/config.const'
import { MaintainSerToken } from '../../monit.routing.token';
import { MaintainService } from '../maintain.service';


interface ParamsForm {
  name: string;
  temp_up: number;
  temp_down: number;
  humi_up: number;
  humi_down: number;
  warning_temp_up: number;
  warning_temp_down: number;
  warning_humi_up: number;
  warning_humi_down: number;
  phone_warn: WarnConf;
  message_warn: WarnConf;
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
    private http: TongchangHttpService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(MaintainSerToken) private maintainSer: MaintainService,
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

  points: MonitPointConf[] = []

  warnTypes = WARN_TYPES
  warnCodeMap = WARN_CODE_MAP


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
   * 获取报警表单组下所有报警电话
   * @param groupName 表单组名
   */
  getPhoneNums(groupName: string): string[] {
    return this.paramsForm.get(groupName).get('nums').value || []
  }

   /**
   * 获取报警表单组下所有预警电话
   * @param groupName 表单组名
   */
  getPhoneNums1(groupName: string): string[] {
    return this.paramsForm.get(groupName).get('warning_nums').value || []
  }

  /**
   * 报警电话添加
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
   * 预警电话添加
   * @param groupName 表单组名
   * @param phoneNoInput 电话输入框 Input
   */
  onPhoneAdd1(groupName: string, phoneNoInput: HTMLInputElement) {
    const phoneNo = phoneNoInput.value
    const numsCtrl  = this.paramsForm.get(groupName).get('warning_nums') as FormControl
    const inputCtrl = this.fb.control(phoneNo, [ Validators.required, SimpPhoneValidator ])

    if (!inputCtrl.valid) return this.msg.error('请输入正确的手机号')
    const nums: string[] = numsCtrl.value || []
    if (nums.indexOf(phoneNo) > -1) return this.msg.error('手机号已添加')
    numsCtrl.setValue([ ...nums, phoneNo ])
    phoneNoInput.value = ''
  }


  /**
   * 报警电话移除
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
   * 预警电话移除
   */
  onPhoneRemove1(groupName: string, index: number) {
    const numsCtrl = this.paramsForm.get(groupName).get('warning_nums') as FormControl
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
      warning_type_name: [[],   [ Validators.required ]],
      warning_nums:  [[],   [ numsValidator       ]],
      warning_delay: [null, [ Validators.required ]],
      warning_span:  [null, [ Validators.required ]],
    }

   
    
    this.paramsForm = this.fb.group({
      name:      [ null, [ Validators.required ]],
      temp_up:   [ null, [ Validators.required ] ],
      temp_down: [ null, [ Validators.required ] ],
      humi_up:   [ null, [ Validators.required ] ],
      humi_down: [ null, [ Validators.required ] ],
      warning_temp_up:   [ null, [ Validators.required ] ],
      warning_temp_down: [ null, [ Validators.required ] ],
      warning_humi_up:   [ null, [ Validators.required ] ],
      warning_humi_down: [ null, [ Validators.required ] ],
      phone_warn:   this.fb.group(warnGroupConf),
      message_warn: this.fb.group(warnGroupConf),
    })
  }

  /**
   * 报警信息显示用
   */
  warnConfForShow(groupName: string) {
    const data: WarnConf = this.paramsForm.get(groupName).value
    // console.log(data);
    return {
      
      
      types: data.types.map(it => this.warnCodeMap[it]).join(','),
      nums:  data.nums.join(','),
      delay: data.delay + '秒',
      span:  data.span + '秒',
      warning_type_name: data.warning_type_name.map(it => this.warnCodeMap[it]).join(','),
      warning_nums: data.warning_nums.join(','),
      warning_delay: data.warning_delay + '秒',
      warning_span:  data.warning_span + '秒',
    }
  }

  /**
   * 更换设备(选择设备)
   */
  async chDevice(point: MonitPointConf) {
    const hasSelect = this.points.map(it => it.code)
    const dev = await this.maintainSer.deviceSelect(hasSelect)
    point.code = dev.code
    point.name = dev.name
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
    console.log(this.fileInput)
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
      case 2:
        console.log( this.paramsForm.valid)
        const {
          temp_up,
          temp_down,
          humi_up,
          humi_down,
          warning_temp_up,
          warning_temp_down,
          warning_humi_up,
          warning_humi_down

        } = this.paramsForm.value

        if (temp_up <= temp_down || warning_temp_up <= warning_temp_down) return this.msg.error('温度上限应大于下限')
        if (humi_up <= humi_down || warning_humi_up <= warning_humi_down) return this.msg.error('湿度上限应大于下限')
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

    const pos: MonitPointConf = {
      x: precent(e.offsetX * 100 / this.imgWidth),
      y: precent(e.offsetY * 100 / this.imgHeight),
      code: '',
      name: '',
    }

    this.points.push(pos)
    DebugLog(JSON.stringify(pos))
  }

  async onSubmit() {
    DebugLog(this.getSubmitData())
    const { messageId } = this.msg.loading('数据提交中...', { nzDuration: 0 })
    const res = await this.http.post<StoreHouse>(
      Apis.storehouse,
      this.getSubmitData()
    ).toPromise()

    this.msg.remove(messageId)
    if (res.code === 0) {
      this.msg.success(res.message)
      this.router.navigate(['..'], { relativeTo: this.route })
    }
  }

  private getSubmitData(): HouseAddData {
    const formVal: ParamsForm = this.paramsForm.getRawValue()

    return {
      id: null,
      ...formVal,
      map:         this.houseImageUrl,
      thermometer: this.points,
    }
  }

  private triggerResize() {
    setTimeout(() => {
      this.imgRectDirective.onResize()
    }, 10);
  }
}
