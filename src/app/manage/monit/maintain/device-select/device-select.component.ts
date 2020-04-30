import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UniversalForm, TongchangHttpService } from 'tongchang-lib';
import { LOGINED_USER_UNIT_KEY } from '@/config.const';
import { Apis } from '@/shared/urls.const';
import { Thermometer } from '@/model/Thermometer';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-device-select',
  templateUrl: './device-select.component.html',
  styleUrls: ['./device-select.component.scss']
})
export class DeviceSelectComponent extends UniversalForm {

  @Input() filterCode: string[] = []

  originData = {}

  therList: Thermometer[] = []

  constructor(
    private fb: FormBuilder,
    private http: TongchangHttpService,
  ) {
    super()
    this.getTher()
  }

  form: FormGroup
  formInit() {
    const form = this.fb.group({
      code: [ null, [ Validators.required ] ],
      name: [ null, [ Validators.required ] ],
    })

    const codeCtrl = form.get('code')
    const nameCtrl = form.get('name')

    codeCtrl.valueChanges.pipe(
      map(code => this.therList.find(it => it.thermometer_code === code)),
      map(ther => ther.name)
    ).subscribe(name => nameCtrl.setValue(name))

    this.form = form
  }

  private async getTher() {
    const uid = localStorage.getItem(LOGINED_USER_UNIT_KEY)

    const res = await this.http.get<Thermometer[]>(
      Apis.storehouseDownTher,
      { uid }
    ).toPromise()

    if (res.code === 0) {
      this.therList = (res.data || []).filter(
        it => this.filterCode.every(i => i !== it.thermometer_code)
      )
    }
  }
}
