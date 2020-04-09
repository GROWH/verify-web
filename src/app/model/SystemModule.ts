import { DataBase } from './Types';

export class SystemModule extends DataBase {
  constructor(type = 1, parent_id = 0, is_menu = true) {
    super()
    this.type = type
    this.is_menu = is_menu
    this.parent_id = parent_id
  }
  key_word:      string;     // 关键字
  module_code:   string;     // 
  module_name:   string;     // 模块名称
  module_url:    string;     // 路由
  order_number:  number;     // 顺序号
  parent_id:     number;     // 父模块 ID
  type:          number;     // 类型
  is_menu:        boolean;    // 是否为系统菜单
}