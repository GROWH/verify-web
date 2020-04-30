import { InjectionToken } from '@angular/core';

import { MaintainService } from './maintain/maintain.service';
import { HandRecordService } from './maintain/hand-record.service';

export const MaintainSerToken = new InjectionToken<MaintainService>('HOUSE_MAINTAIN')
export const HandRecordSerToken = new InjectionToken<HandRecordService>('HAND_RECORD')