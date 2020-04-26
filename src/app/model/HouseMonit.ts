export interface WarnConf {
  types: string[];  // 报警类型
  nums:  string[];  // 报警电话
  delay: number;    // 延时
  span:  number;    // 报警间隔
}

export interface MonitPoint {
  x: number;
  y: number;
  code: string;
  name: string;
}

export interface HouseAddData {
  name:         string;        // 库房名称
  map:          string;        // 库房平面图
  temp_up:      number;        // 最高温度
  temp_down:    number;        // 最低温度
  humi_up:      number;        // 最高湿度
  humi_down:    number;        // 最低湿度
  phone_warn:   WarnConf;      // 电话报警设定
  message_warn: WarnConf;      // 短信报警设定
  thermometer:  MonitPoint[];       // 监控点位
}