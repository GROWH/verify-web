import { DataBase } from './Types';
import { Unit } from './Unit';

export interface WarnConf {
  types: string[];  // 报警类型
  nums:  string[];  // 报警电话
  delay: number;    // 延时
  span:  number;    // 报警间隔
}

export interface MonitPointConf {
  x: number;
  y: number;
  code: string;
  name: string;
}

export class MonitPoint extends DataBase {
  code:          string;  // 温度计编码
  curr_humi:     number;  // 当前湿度
  curr_temp:     number;  // 当前温度
  last_uptime:   string;  // 最后更新时间
  name:          string;  // 点位名称
  storehouse_id: number;  // 库房 ID
  x:             number;  // x 坐标
  y:             number;  // y 坐标
}

export class PointRecord {
  id:          number;
  humi:        number;
  temp:        number;
  time:        string;
  position_id: number;
}

export interface HouseAddData {
  id:          number;
  name:         string;        // 库房名称
  map:          string;        // 库房平面图
  temp_up:      number;        // 最高温度
  temp_down:    number;        // 最低温度
  humi_up:      number;        // 最高湿度
  humi_down:    number;        // 最低湿度
  phone_warn:   WarnConf;      // 电话报警设定
  message_warn: WarnConf;      // 短信报警设定
  thermometer:  MonitPointConf[];       // 监控点位
}

export class Warn extends DataBase {
  types:         string[];  // 报警类型
  nums:          string[];  // 报警电话
  delay:         number;    // 延时
  span:          number;    // 报警间隔
  storehouse_id: number;    //
  way:           string;    //
}

export class StoreHouse extends DataBase {
  name:         string;
  map:          string;
  temp_up:      number;
  temp_down:    number;
  humi_up:      number;
  humi_down:    number;
  phone_warn:   Warn;
  message_warn: Warn;
  thermometer:  MonitPointConf[];
  units:        Unit[];
  state:        string;        // 状态
  new_uptime:   string;        // 最后上传时间
}

export class HandRecord extends DataBase {

  constructor(hosid: number) {
    super()
    this.storehouse_id = hosid
  }

  temp:           string;     // 温度
  humi:           string;     // 湿度
  position:       string;     // 检查位置
  storehouse_id:  number;     // 库房id
  record_time:    string;     // 检查时间
}
