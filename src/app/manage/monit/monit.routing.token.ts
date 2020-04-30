import { InjectionToken } from '@angular/core';

import { MaintainService } from './maintain/maintain.service';
import { HandRecordService } from './maintain/hand-record.service';
import { MyHouseService } from './my-house/my-house.service';

export const MaintainSerToken = new InjectionToken<MaintainService>('HOUSE_MAINTAIN')
export const HandRecordSerToken = new InjectionToken<HandRecordService>('HAND_RECORD')
export const MyHouseSerToken = new InjectionToken<MyHouseService>('MY_HOUSE')