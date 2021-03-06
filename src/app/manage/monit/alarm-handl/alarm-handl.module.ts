import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AlarmHandlComponent } from "./alarm-handl/alarm-handl.component";
import { SharedModule } from "@/shared/shared.module";
import { HandleStateFormComponent } from "./handle-state-form/handle-state-form.component";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [AlarmHandlComponent, HandleStateFormComponent],
    imports: [CommonModule, SharedModule, FormsModule],
  entryComponents: [HandleStateFormComponent],
})
export class AlarmHandlModule {}
