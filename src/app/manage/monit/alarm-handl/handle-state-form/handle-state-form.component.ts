import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
// import { HandleState } from "@/model/HouseMonit";
import { TableList } from "../alarm-handl/alarm-handl.component";

@Component({
  selector: "app-handle-state-form",
  templateUrl: "./handle-state-form.component.html",
  styleUrls: ["./handle-state-form.component.scss"],
})
export class HandleStateFormComponent implements OnInit {
  @Input() house: TableList;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.formInit(this.house);
  }

  form: FormGroup;

  //弹框中表单的初始化
  formInit(house: TableList) {
    this.form = this.fb.group({
      cause: [house.cause, [Validators.required]],
      method: [house.method, [Validators.required]],
      remarks: [house.remarks],
      processor: [house.processor, [Validators.required]],
    });
  }

  //获取表单的值
  get formVal() {
    return {
      ...this.house,
      ...this.form.getRawValue(),
    };
  }
}
