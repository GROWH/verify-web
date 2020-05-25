import { InjectionToken } from '@angular/core';
import { BaseInfoService } from './base-info/base-info.service';

export const BaseInfoSerToken = new InjectionToken<BaseInfoService>('BASE_INFO')
