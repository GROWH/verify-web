import { DataBase } from './Types';

export class BaseInfo extends DataBase {
  // 新增接口
  client_id:             number;        // 验证对象单位
  implement_id:          string;        // 验证实施单位
  client_type:           string;        // 验证对象单位类别
  target_type:           string;        // 验证对象类别
  verify_time:           string;        // 验证时间
  verify_invalid_time:   string;        // 验证到期时间
  warn_before:           number;        // 下次验证预警时间(天数)
  point_conf:            string;        // 布点配置

  // 库房 冷藏车 冷柜
  temp_up?:              number;        // 温度上限
  temp_down?:            number;        // 温度下限
  fan?:                  number;        // 风机数量
  blind_point?:          number;        // 死角数量
  monit_point?:          number;        // 监控探头数量
  door?:                 number;        // 出入口数量
  fan_conf?:             string;        // 风机配置 (JSON str)

  // 库房
  height?:               number;        // 高度
  width?:                number;        // 宽度
  length?:               number;        // 长度
  vol?:                  number;        // 体积
  area?:                 number;        // 面积
  lamp?:                 number;        // 照明灯数量
  windows?:              number;        // 窗户数量
  shelf?:                number;        // 货架数量

  // 冷藏车
  car_vol?:              number;        // 车厢体积
  car_area?:             number;        // 车厢面积

  // 冷柜
  cooler_vol?:           number;        // 冷柜体积

  // 保温箱
  box_count?:            number;        // 保温箱数量
}

const StockTargetConf = {
  env: 3,
  lamp: 5,
  matrix: 86,
  windows: 5,
  monit: 30,
  door: [
    { name: '1号门', count: 3 },
    { name: '2号门', count: 4 },
  ],
  fan_out: [
    { name: '1号风机出风口', count: 5 },
    { name: '2号风机出风口', count: 6 },
  ],
  fan_in: [
    { name: '1号风机回风口', count: 5 },
    { name: '2号风机回风口', count: 6 },
  ],
  bland: [
    { name: '1号死角', count: 5 },
    { name: '2号死角', count: 4 },
  ],
  others: [
    { name: '法规新增测点1', count: 10 },
    { name: '法规新增测点2', count: 10 },
  ]
}
