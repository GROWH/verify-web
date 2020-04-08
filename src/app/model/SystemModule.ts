import { DataBase } from './Types';

export class SystemModule extends DataBase {
  key_word:      string;      // 关键字
  module_code:   string;     // 
  module_name:   string;     // 模块名称
  module_url:    string;     // 路由
  order_number:  number;     // 顺序号
  parent_id:     number;     // 父模块 ID
  type:          string;     // 类型
  isMenu:        boolean;    // 是否为系统菜单
}